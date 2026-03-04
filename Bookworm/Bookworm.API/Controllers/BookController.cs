using Bookworm.API.Data;
using Bookworm.API.Dtos;
using Bookworm.API.Entity;
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
    var books = await _context.Books
        .Include(b => b.Author)
        .Include(b => b.Category)
        .Select(b => new BookDto
        {
            Id = b.Id,
            Title = b.Title!,
            AuthorName = b.Author!.Name,
            CategoryName = b.Category!.Name,
            Isbn = b.Isbn!,
            Price = b.Price!,
            Stock = b.Stock!,
            Description = b.Description,
            IsActive = b.IsActive!,
            ImgUrl = b.ImgUrl
        })
        .ToListAsync();

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

        [HttpPost]
public async Task<IActionResult> CreateBook(BookCreateDto bookDto)
{
    var category = await _context.Categories
        .FirstOrDefaultAsync(c => c.Id == bookDto.CategoryId);
    if (category == null)
        return BadRequest("Geçersiz kategori.");

    var author = await _context.Authors
        .FirstOrDefaultAsync(a => a.Id == bookDto.AuthorId);
    if (author == null)
        return BadRequest("Geçersiz yazar.");

    var book = new Book
    {
        Title = bookDto.Title,
        Isbn = bookDto.Isbn,
        Price = bookDto.Price,
        Stock = bookDto.Stock,
        Description = bookDto.Description,
        IsActive = bookDto.IsActive,
        ImgUrl = bookDto.ImgUrl,
        AuthorId = author.Id,
        CategoryId = category.Id
    };

    _context.Books.Add(book);
    await _context.SaveChangesAsync();

    return CreatedAtAction(nameof(GetBook), new { id = book.Id }, book.Id);
}

// [HttpPost("edit")]
// public async Task<IActionResult> EditBook(UpdateBookDto bookDto)
// {
//     if (!ModelState.IsValid)
//         return BadRequest(ModelState);

//     var book = await _context.Books.FindAsync(bookDto.Id);
//     if (book == null)
//         return NotFound("Book not found.");

//     var category = await _context.Categories.FindAsync(bookDto.CategoryId);
//     if (category == null)
//         return BadRequest("Geçersiz kategori.");

//     var author = await _context.Authors.FindAsync(bookDto.AuthorId);
//     if (author == null)
//         return BadRequest("Geçersiz yazar.");

//     book.Title = bookDto.Title;
//     book.Isbn = bookDto.Isbn;
//     book.Price = bookDto.Price;
//     book.Stock = bookDto.Stock;
//     book.Description = bookDto.Description;
//     book.IsActive = bookDto.IsActive;
//     book.ImgUrl = bookDto.ImgUrl;
//     book.AuthorId = author.Id;
//     book.CategoryId = category.Id;

//     await _context.SaveChangesAsync();

//     var updatedBook = await _context.Books
//         .Include(b => b.Author)
//         .Include(b => b.Category)
//         .Where(b => b.Id == book.Id)
//         .Select(b => new BookDto
//         {
//             Id = b.Id,
//             Title = b.Title!,
//             AuthorName = b.Author!.Name,
//             CategoryName = b.Category!.Name,
//             Isbn = b.Isbn!,
//             Price = b.Price!,
//             Stock = b.Stock!,
//             Description = b.Description,
//             IsActive = b.IsActive!,
//             ImgUrl = b.ImgUrl
//         })
//         .FirstOrDefaultAsync();

//     return Ok(updatedBook);
// }
    
    }
}
