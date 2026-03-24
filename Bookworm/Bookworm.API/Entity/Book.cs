using Bookworm.API.Data;
using System.ComponentModel.DataAnnotations;

namespace Bookworm.API.Entity
{
	public class Book
	{
		[Key]
		public int Id { get; set; }
		[Required]
		public string? Title { get; set; }
		public string? Isbn { get; set; }

		public decimal? Price { get; set; }
		public int? Stock { get; set; }
		public string? Description { get; set; }
		public bool? IsActive { get; set; } 
		public string? ImgUrl { get; set; }

        public int CategoryId { get; set; }
		public Category? Category { get; set; }

		public int AuthorId {get;set;}
		public Author? Author { get; set; }

		public ICollection<Comment>? Comments { get; set; }
		public ICollection<Rating>? Ratings { get; set; }
	}
}