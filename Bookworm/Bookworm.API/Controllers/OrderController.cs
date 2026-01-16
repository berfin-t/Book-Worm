using Bookworm.API.Data;
using Bookworm.API.Dtos;
using Bookworm.API.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ABookworm.API.Controller;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class OrderController: ControllerBase
{
    private readonly DataContext _context;

    public OrderController (DataContext context)
    {
        _context = context;
    }

    [HttpGet("GetOrders")]
    public async Task<ActionResult<List<OrderDto>>> GetOrder()
    {
        return await _context.Orders
        .Include(i=>i.OrderItems)
        .OrderToDto()
        .Where(i=>i.CustomerId==User.Identity!.Name)
        .ToListAsync();
    }

    [HttpGet("{id}", Name = "GetOrder")]
        public async Task<ActionResult<OrderDto?>> GetOrder(int id)
        {
            return await _context.Orders
                        .Include(i => i.OrderItems)
                        .OrderToDto()
                        .Where(i => i.CustomerId == User.Identity!.Name && i.Id == id)
                        .FirstOrDefaultAsync();
        }
}