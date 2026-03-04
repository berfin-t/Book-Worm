namespace Bookworm.API.Dtos;
public class BookCreateDto
{
    public int Id { get; set; }
    public string Title { get; set; } = null!;
    public int AuthorId { get; set; }
    public int CategoryId { get; set; }
    public string Isbn { get; set; } = null!;
    public decimal? Price { get; set; }
    public int? Stock { get; set; }
    public string? Description { get; set; }
    public bool? IsActive { get; set; }
    public string? ImgUrl { get; set; }
}
