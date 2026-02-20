namespace Bookworm.API.Dtos;
public class BookDto
{
    public int Id { get; set; }
    public string Title { get; set; } = null!;
    public string? AuthorName { get; set; } 
    public string CategoryName { get; set; } = null!;
    public string Isbn { get; set; } = null!;
    public decimal? Price { get; set; }
    public int? Stock { get; set; }
    public string? Description { get; set; }
    public bool? IsActive { get; set; }
    public string? ImgUrl { get; set; }
}
