namespace Bookworm.API.Dtos;
public class UpdateBookDto
{
    public int Id { get; set; }
    public int AuthorId { get; set; }
    public int CategoryId { get; set; }
    public string? Title { get; set; }
    public string? Isbn { get; set; }
    public decimal? Price { get; set; }
    public int? Stock { get; set; }
    public string? Description { get; set; }
    public bool? IsActive { get; set; }
    public string? ImgUrl { get; set; }
}
