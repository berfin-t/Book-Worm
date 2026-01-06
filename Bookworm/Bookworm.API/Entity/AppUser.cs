using Microsoft.AspNetCore.Identity;

namespace BookWorm.API.Entity
{
	public class AppUser: IdentityUser
	{
		public string? Name { get; set; }
    }
}