using Bookworm.API.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Bookworm.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategoryController : ControllerBase
    {
        private readonly DataContext _context;
        public CategoryController(DataContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetCategories()
        {
            var categories = await _context.Categories.ToListAsync();
            return Ok(categories);
        }

        [HttpGet("with-count")]
        public async Task<IActionResult> GetCategoriesWithBookCount()
        {
            var categoriesWithCount = await _context.Categories
                .Select(c => new
                {
                    c.Id,
                    c.Name,
                    BookCount = c.Books.Count
                })
                .ToListAsync();
            return Ok(categoriesWithCount);

        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetCategoryById(int? id)
        {
            if(id == null)
            return NotFound();
            
            var category = await _context.Categories
            .Include(c => c.Books)
            .Where(c => c.Id == id)
            .Select(c => new
            {
                c.Id,
                c.Name,
                Books = c.Books.Select(b => new
                {
                    b.Id,
                    b.Title,
                    b.Price,
                    b.ImgUrl
                }).ToList()
            })
            .FirstOrDefaultAsync();

            if (category == null)
            {
                return NotFound();
            }
            return Ok(category);
        }
    }
}
