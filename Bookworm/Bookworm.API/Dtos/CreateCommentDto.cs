namespace Bookworm.API.Dtos;
public class CreateCommentDto
    {
        public int BookId { get; set; }
        public string Content { get; set; } = string.Empty;
    }