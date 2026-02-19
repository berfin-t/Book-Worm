using Bookworm.API.Data;
using Bookworm.API.Dtos;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Bookworm.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthorController : ControllerBase
    {
        private readonly DataContext _context;

        public AuthorController(DataContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAuthors()
        {
            var authors = await _context.Authors.ToListAsync();
            return Ok(authors);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetAuthor(int? id)
        {
            if (id == null)
                return NotFound();

            var author = await _context.Authors
                    .Where(a=> a.Id == id)
                    .Select(a => new AuthorDto
                    {
                        Id = a.Id,
                        Name = a.Name,
                        Bio = a.Bio,
                        ImgUrl = a.ImgUrl,
                        Books = a.Books!.Select(b => new BookDto
                    {
                        Id = b.Id,
                        Title = b.Title!,
                        Price = b.Price,
                        ImgUrl = b.ImgUrl
                        }).ToList()
                    }).FirstOrDefaultAsync();

                    if(author == null) 
                        return NotFound();

                    return Ok(author);
        }
    }
}
