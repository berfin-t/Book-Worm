namespace Bookworm.API.Dtos;

public class CategoryWithCountDto
{
	public int Id { get; set; }
	public string Name { get; set; } = null!;
	public int BookCount { get; set; }
}