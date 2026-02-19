using Bookworm.API.Data;
using Bookworm.API.Dtos;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Bookworm.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BookController : ControllerBase
    {
        private readonly DataContext _context;

        public BookController(DataContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetBooks()
        {
            var books = await _context.Books.ToListAsync();
            return Ok(books);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetBook(int? id)
        {
            if (id == null)
                return NotFound();

            var book = await _context.Books
        .Include(b => b.Author)
        .Include(b => b.Category)
        .Where(b => b.Id == id)
        .Select(b => new BookDto
        {
            Id = b.Id,
            Title = b.Title!,
            AuthorName = b.Author!.Name!,
            CategoryName = b.Category!.Name,
            Isbn = b.Isbn!,
            Price = b.Price!,
            Stock = b.Stock!,
            Description = b.Description,
            IsActive = b.IsActive!,
            ImgUrl = b.ImgUrl
        })
        .FirstOrDefaultAsync();

            if (book == null)
                return NotFound();

            return Ok(book);
        }
    }
}
