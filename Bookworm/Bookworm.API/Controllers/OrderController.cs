using Bookworm.API.Data;
using Bookworm.API.Dtos;
using Bookworm.API.Entity;
using Bookworm.API.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Bookworm.API.Controller;

[ApiController]
[Route("api/[controller]")]
public class OrderController: ControllerBase
{
    private readonly DataContext _context;

    public OrderController (DataContext context)
    {
        _context = context;
    }

    [HttpGet]
    [Authorize(Roles = "Customer")]
    public async Task<ActionResult<List<OrderDto>>> GetOrder()
    {
        return await _context.Orders
        .Include(i=>i.OrderItems)
        .OrderToDto()
        .Where(i=>i.CustomerId==User.Identity!.Name)
        .ToListAsync();
    }

    [HttpGet("get-by-admin")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<List<OrderDto>>> GetOrderByAdmin()
    {
        return await _context.Orders
        .Include(i=>i.OrderItems)
        .OrderToDto()
        .ToListAsync();
    }

    [HttpGet("{id}")]
    [Authorize(Roles = "Customer")]
        public async Task<ActionResult<OrderDto?>> GetOrder(int id)
        {
            return await _context.Orders
                        .Include(i => i.OrderItems)
                        .OrderToDto()
                        .Where(i => i.CustomerId == User.Identity!.Name && i.Id == id)
                        .FirstOrDefaultAsync();
        }

    [HttpPost]
    [Authorize(Roles = "Customer")]
    public async Task<ActionResult<Order>> CreateOrder(CreateOrderDto createOrderDto)
    {
        var cart = await _context.Carts
        .Include(i=>i.CartItems)
        .ThenInclude(i=>i.Book)
        .Where(i=>i.CustomerId== User.Identity!.Name)
        .FirstOrDefaultAsync();

        if(cart==null) return BadRequest(new ProblemDetails{Title="Problem getting cart"});

        var items = new List<OrderItem>();

        foreach (var item in cart.CartItems)
        {
            var book = await _context.Books.FindAsync(item.BookId);

            var orderItem = new OrderItem
            {
                BookId = book!.Id,
                BookName = book.Title!,
                BookImage = book.ImgUrl!,
                Price = book.Price ?? 0m,
                Quantity = item.Quantity
            };

            items.Add(orderItem);
            book.Stock -= item.Quantity;
        }

        var subTotal = items.Sum(i=>i.Price * i.Quantity);
        var deliveryFree = 0;

        var order = new Order
            {
                OrderItems = items,
                CustomerId = User.Identity!.Name,
                FirstName = createOrderDto.FirstName,
                LastName = createOrderDto.LastName,
                Phone = createOrderDto.Phone,
                City = createOrderDto.City,
                AddresLine = createOrderDto.AddresLine,
                SubTotal = subTotal,
                DeliveryFree = deliveryFree
            };

            _context.Orders.Add(order);
            _context.Carts.Remove(cart);

            var result = await _context.SaveChangesAsync() > 0;

            if(result)
                return CreatedAtAction(nameof(GetOrder), new {id = order.Id}, order.Id);
            
            return BadRequest(new ProblemDetails { Title = "Problem getting order" });
    }

    [HttpGet("count")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<int>> GetTotalOrderCount()
    {
        return await _context.Orders.CountAsync();
    }

    [HttpGet("today")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<List<OrderDto>>> GetTodayOrders()
    {
        var today = DateTime.UtcNow.Date;

        return await _context.Orders
            .Where(o => o.OrderDate >= today && o.OrderDate < today.AddDays(1))
            .OrderToDto()
            .ToListAsync();
    }
}