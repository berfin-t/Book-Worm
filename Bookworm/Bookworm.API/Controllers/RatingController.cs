using Bookworm.API.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Bookworm.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RatingController : ControllerBase
    {
        private readonly DataContext _context;

        public RatingController(DataContext context)
        {
            _context = context;
        }

        [HttpGet("book/{bookId}")]
        public async Task<IActionResult> GetRatingsByBook(int bookId)
        {
            var ratings = await _context.Ratings
                .Where(r => r.BookId == bookId)
                .Include(r => r.User)
                .Select(r => new
                {
                    r.Id,
                    r.Score,
                    UserName = r.User!.UserName,
                    UserFullName = r.User.Name
                })
                .ToListAsync();

            return Ok(ratings);
        }
    }
}