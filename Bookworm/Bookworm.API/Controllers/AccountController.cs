using Bookworm.API.Entity;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Bookworm.API.Dtos;
using Bookworm.API.Services;
using Microsoft.AspNetCore.Authorization;

namespace Bookworm.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AccountController : ControllerBase
{
    public readonly UserManager<AppUser> _userManager;
    public readonly TokenService _tokenService;

    public AccountController(UserManager<AppUser> userManager, TokenService tokenService)
    {
        _userManager = userManager;
        _tokenService = tokenService;
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
            return Ok(new UserDto
            {
                Name = user.Name!,
                Token = await _tokenService.GenerateTokenAsync(user)
            });
        }

        return Unauthorized();
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

        return Ok(result);
    }

    [Authorize]
    [HttpGet("getUser")]
    public async Task<ActionResult<UserDto>> GetUser()
    {
        var user = await _userManager.FindByNameAsync(User.Identity?.Name!);

        if(user == null)
        {
            return BadRequest(new ProblemDetails { Title = "Username ya da password hataý!"});
        }

        return new UserDto
        {
            Name = user.Name!,
            Token = await _tokenService.GenerateTokenAsync(user)
        };

    }
}