using Bookworm.API.Entity;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Bookworm.API.Dtos;
using Bookworm.API.Services;
using Microsoft.AspNetCore.Authorization;
using Bookworm.API.Data;
using Microsoft.EntityFrameworkCore;

namespace Bookworm.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AccountController : ControllerBase
{
    public readonly UserManager<AppUser> _userManager;
    public readonly TokenService _tokenService;
    public readonly DataContext _context;

    public AccountController(UserManager<AppUser> userManager, TokenService tokenService, DataContext context)
    {
        _userManager = userManager;
        _tokenService = tokenService;
        _context = context;
    }    

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDto loginDto)
    {
        var user = await _userManager.FindByNameAsync(loginDto.Username);

        if (user == null)
        {
            return BadRequest("Invalid username or password");
        }

        var result = await _userManager.CheckPasswordAsync(user, loginDto.Password);

        if (result)
        {
            var userCart = await GetOrCreate(loginDto.Username);
            var cookiesCart = await GetOrCreate(Request.Cookies["customerId"]!);

            if (userCart != null) {
                foreach (var item in userCart.CartItems)
                {
                    cookiesCart.AddItem(item.Book, item.Quantity);
                }
                _context.Carts.Remove(userCart);
            }

            cookiesCart.CustomerId = loginDto.Username;
            await _context.SaveChangesAsync();

                return Ok(new UserDto
            {
                Name = user.Name!,
                Token = await _tokenService.GenerateTokenAsync(user)
            });
        }

        return Unauthorized();
    }

    private async Task<Cart> GetOrCreate(string custId)
    {
        var cart = await _context.Carts
                    .Include(i => i.CartItems)
                    .ThenInclude(i => i.Book)
                    .Where(i => i.CustomerId == custId)
                    .FirstOrDefaultAsync();

        if (cart == null)
        {
            var customerId = User.Identity?.Name;

            if (string.IsNullOrEmpty(customerId))
            {
                customerId = Guid.NewGuid().ToString();
                var cookieOptions = new CookieOptions
                {
                    Expires = DateTime.Now.AddMonths(1),
                    IsEssential = true
                };

                Response.Cookies.Append("customerId", customerId, cookieOptions);
            }

            cart = new Cart { CustomerId = customerId };

            _context.Carts.Add(cart);
            await _context.SaveChangesAsync();
        }

        return cart;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterDto registerDto)
    {
        if(!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var user = new AppUser
        {
            Name = registerDto.Name,
            UserName = registerDto.Username,
            Email = registerDto.Email
        };

        var result = await _userManager.CreateAsync(user, registerDto.Password);

        if (!result.Succeeded)
        {
            return BadRequest(result.Errors);
        }

        await _userManager.AddToRoleAsync(user, "Customer");
        return Ok(new { message = "User registered successfully" });
    }

    [Authorize]
    [HttpGet("getUser")]
    public async Task<ActionResult<UserDto>> GetUser()
    {
        var user = await _userManager.FindByNameAsync(User.Identity?.Name!);

        if(user == null)
        {
            return BadRequest(new ProblemDetails { Title = "Username ya da password hata�!"});
        }

        return new UserDto
        {
            Name = user.Name!,
            Token = await _tokenService.GenerateTokenAsync(user)
        };

    }
}