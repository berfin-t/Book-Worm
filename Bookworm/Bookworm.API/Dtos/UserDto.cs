namespace Bookworm.API.Dtos;

public class UserDto
{
    public string Name { get; set; } = null!;
    public string Token { get; set; } = null!;
    public List<string> Roles { get; set; } = new();

}