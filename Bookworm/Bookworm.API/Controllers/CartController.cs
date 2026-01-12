using Bookworm.API.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Bookworm.API.Entity;
using Bookworm.API.Dtos;

namespace Bookworm.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CartController : ControllerBase
{
    private readonly DataContext _context;
    public CartController(DataContext context)
    {
        _context = context;
    }

    private string GetCustomerId()
    {
        return User.Identity?.Name ?? Request.Cookies["customerId"]!;
    }

    [HttpGet]
    public async Task<ActionResult<CartDto>> GetCarts()
    {
        return CartToDto(await GetOrCreate(GetCustomerId()));
    }

    [HttpPost]
    public async Task<ActionResult> AddItemToCart(int bookId, int quantity)
    {
        var cart = await GetOrCreate(GetCustomerId());

        var book = await _context.Books.FirstOrDefaultAsync(b => b.Id == bookId);

        if(book==null) 
            return NotFound("The book ist not in database");

        cart.AddItem(book, quantity);

        var result = await _context.SaveChangesAsync() > 0;

        if(result)
            return CreatedAtAction(nameof(GetCarts), CartToDto(cart));

        return BadRequest(new ProblemDetails { Title = "The book can not be added to cart"});
    }

    [HttpDelete]
    public async Task<ActionResult> DeleteItemFromCart(int bookId, int quantity)
    {
        var cart = await GetOrCreate(GetCustomerId());

        cart.DeleteItem(bookId, quantity);

        var result = await _context.SaveChangesAsync() > 0;

        if(result)
            return CreatedAtAction(nameof(GetCarts), CartToDto(cart));

        return BadRequest(new ProblemDetails { Title = "The book can not be removed from cart"});
    }

    private async Task<Cart> GetOrCreate(string custId)
    {
        var cart = await _context.Carts
            .Include(c => c.CartItems)
            .ThenInclude(c => c.Book)
            .Where(c => c.CustomerId == Request.Cookies["customerId"])
            .FirstOrDefaultAsync();

        if(cart == null)
        {
            var customerId = Guid.NewGuid().ToString();

            var cookiesOptions = new CookieOptions
            {
                IsEssential = true,
                Expires = DateTime.Now.AddMonths(1)
            };

            Response.Cookies.Append("customerId", customerId, cookiesOptions);
            cart = new Cart { CustomerId = customerId };

            _context.Carts.Add(cart);
            await _context.SaveChangesAsync();
        }
        return cart;
    }

    private CartDto CartToDto(Cart cart)
    {
        return new CartDto
        {
           CartId = cart.CartId,
            CustomerId = cart.CustomerId,
            CartItems = cart.CartItems.Select(ci => new CartItemDto
            {
                BookId = ci.BookId,
                Name = ci.Book.Title,
                Price = ci.Book.Price,                
                Quantity = ci.Quantity,
                ImgUrl = ci.Book.ImgUrl
            }).ToList()
        };
    }
}
