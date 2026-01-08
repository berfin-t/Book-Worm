using System.ComponentModel.DataAnnotations;

namespace Bookworm.API.Dtos
{
    public class RegisterDto
    {
        [Required]
        public string Name { get; set; } = null!;
        [Required]
        public string Username { get; set; } = null!;
        [Required]
        [EmailAddress]
        public string Email { get; set; } = null!;
        [Required]
        public string Password { get; set; } = null!;
    }
}