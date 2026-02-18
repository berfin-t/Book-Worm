using System.ComponentModel.DataAnnotations;

namespace Bookworm.API.Entity
{
	public class Author
	{
		[Key]
		public int Id { get; set; }
        [Required]
        public string? Name { get; set; }

        public string? Bio { get; set; }

        public string? ImgUrl { get; set; }
        public ICollection<Book>? Books { get; set; }
    }
}