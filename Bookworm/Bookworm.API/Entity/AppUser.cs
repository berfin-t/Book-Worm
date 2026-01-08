using Microsoft.AspNetCore.Identity;

namespace Bookworm.API.Entity;

public class AppUser: IdentityUser
{
	public string? Name { get; set; }
}