namespace Bookworm.API.Dtos
{
    public class CreateRatingDto
    {
        public int BookId { get; set; }
        public int Score { get; set; }
    }
}