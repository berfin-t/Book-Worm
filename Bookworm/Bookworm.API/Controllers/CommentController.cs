using Bookworm.API.Data;
using Bookworm.API.Dtos;
using Bookworm.API.Entity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Bookworm.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CommentController : ControllerBase
    {
        private readonly DataContext _context;

        public CommentController(DataContext context)
        {
            _context = context;
        }

        [HttpGet("book/{bookId}")]
        public async Task<IActionResult> GetCommentsByBook(int bookId)
        {
            var comments = await _context.Comments
                .Where(c => c.BookId == bookId)
                .Include(c => c.User)
                .Select(c => new
                {
                    c.Id,
                    c.Content,
                    c.CreatedAt,
                    UserName = c.User!.UserName,
                    UserFullName = c.User.Name
                })
                .ToListAsync();

            return Ok(comments);
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> AddComment([FromBody] CreateCommentDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized();

            var bookExists = await _context.Books.AnyAsync(b => b.Id == dto.BookId);
            if (!bookExists) return NotFound("Book not found.");

            var comment = new Comment
            {
                Content = dto.Content,
                BookId = dto.BookId,
                UserId = userId,
                CreatedAt = DateTime.UtcNow
            };

            _context.Comments.Add(comment);
            await _context.SaveChangesAsync();

            return Ok(comment);
        }

        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateComment(int id, [FromBody] UpdateCommentDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var comment = await _context.Comments.FindAsync(id);
            if (comment == null) return NotFound("Comment not found.");

            if (comment.UserId != userId) return Forbid();

            comment.Content = dto.Content;
            await _context.SaveChangesAsync();

            return Ok(comment);
        }

        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteComment(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var isAdmin = User.IsInRole("Admin");

            var comment = await _context.Comments.FindAsync(id);
            if (comment == null) return NotFound("Comment not found.");

            if (comment.UserId != userId && !isAdmin) return Forbid();

            _context.Comments.Remove(comment);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }       
}