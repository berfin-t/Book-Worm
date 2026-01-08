using Bookworm.API.Entity;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Bookworm.API.Dtos;
using Bookworm.API.Services;

namespace Bookworm.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AccountController : ControllerBase
{
    public readonly UserManager<AppUser> _userMaanager;
    public readonly TokenService _tokenService;

    public AccountController(UserManager<AppUser> userManager, TokenService tokenService)
    {
        _userMaanager = userManager;
        _tokenService = tokenService;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDto loginDto)
    {
        var user = await _userMaanager.FindByNameAsync(loginDto.Username);

        if (user == null)
        {
            return BadRequest("Invalid username or password");
        }

        var result = await _userMaanager.CheckPasswordAsync(user, loginDto.Password);

        if (!result)
        {
            return BadRequest("Invalid username or password");
        }

        return Ok(new{ token = await _tokenService.GenerateTokenAsync(user) });

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

        var result = await _userMaanager.CreateAsync(user, registerDto.Password);

        if (!result.Succeeded)
        {
            return BadRequest(result.Errors);
        }

        return Ok(result);
    }
}