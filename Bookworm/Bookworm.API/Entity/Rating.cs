using System.ComponentModel.DataAnnotations;

namespace Bookworm.API.Entity
{
    public class Rating
    {
        [Key]
        public int Id { get; set; }

        [Range(1, 5)]
        public int Score { get; set; }  
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public int BookId { get; set; }
        public Book? Book { get; set; }

        public string UserId { get; set; } = string.Empty;
        public AppUser? User { get; set; }
    }
}