namespace Bookworm.API.Dtos; 

public class AuthorDto
{
    public int Id { get; set; }
    public string? Name { get; set; }
    public string? Bio { get; set; }
    public string? ImgUrl { get; set; }
    public ICollection<BookDto>? Books { get; set; }
}