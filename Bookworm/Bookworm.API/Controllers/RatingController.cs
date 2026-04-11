using System.Security.Claims;
using Bookworm.API.Data;
using Bookworm.API.Dtos;
using Bookworm.API.Entity;
using Microsoft.AspNetCore.Authorization;
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

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> AddRating([FromBody] CreateRatingDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized();

            var bookExists = await _context.Books.AnyAsync(b => b.Id == dto.BookId);
            if (!bookExists) return NotFound("Book not found.");

            var existingRating = await _context.Ratings
                .FirstOrDefaultAsync(r => r.BookId == dto.BookId && r.UserId == userId);

            if (existingRating != null)
            {
                existingRating.Score = dto.Score;
                _context.Ratings.Update(existingRating);
            }
            else
            {
                var rating = new Rating
                {
                    Score = dto.Score,
                    BookId = dto.BookId,
                    UserId = userId
                };
                _context.Ratings.Add(rating);
            }

            await _context.SaveChangesAsync();
            return Ok();
        }
        
        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateRating(int id, [FromBody] CreateRatingDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized();

            var rating = await _context.Ratings.FindAsync(id);
            if (rating == null) return NotFound("Rating not found.");

            if (rating.UserId != userId) return Unauthorized();

            rating.Score = dto.Score;
            _context.Ratings.Update(rating);
            await _context.SaveChangesAsync();

            return Ok();
        }

        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRating(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized();

            var rating = await _context.Ratings.FindAsync(id);
            if (rating == null) return NotFound("Rating not found.");

            if (rating.UserId != userId) return Unauthorized();

            _context.Ratings.Remove(rating);
            await _context.SaveChangesAsync();

            return Ok();
        }
    }
}