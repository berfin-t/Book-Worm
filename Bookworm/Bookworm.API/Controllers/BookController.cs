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

[HttpPut("{id}")]
public async Task<IActionResult> UpdateBook(int id, UpdateBookDto dto)
{
    var book = await _context.Books.FindAsync(id);

    if (book == null)
        return NotFound();

    book.Title = dto.Title;
    book.Isbn = dto.Isbn;
    book.Price = dto.Price;
    book.Stock = dto.Stock;
    book.Description = dto.Description;
    book.IsActive = dto.IsActive;
    book.ImgUrl = dto.ImgUrl;
    book.AuthorId = dto.AuthorId;
    book.CategoryId = dto.CategoryId;

    await _context.SaveChangesAsync();

    return Ok(book);
}

[HttpDelete("{id}")]
public async Task<IActionResult> SoftDeleteBook(int id)
{
    var book = await _context.Books.FindAsync(id);

    if (book == null)
        return NotFound();

    book.IsActive = false;

    await _context.SaveChangesAsync();

    return Ok("Kitap pasif hale getirildi.");
}
    }
}
