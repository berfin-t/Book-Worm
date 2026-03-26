using Bookworm.API.Data;
using Bookworm.API.Dtos;
using Bookworm.API.Entity;
using Bookworm.API.Extensions;
using Iyzipay;
using Iyzipay.Model;
using Iyzipay.Request;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Bookworm.API.Controller;

[ApiController]
[Route("api/[controller]")]
public class OrderController: ControllerBase
{
    private readonly DataContext _context;
    private readonly IConfiguration _config;

    public OrderController (DataContext context, IConfiguration config)
    {
        _context = context;
        _config = config;
    }

    #region Get Orders
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
    #endregion

    #region Get Orders By Admin
    [HttpGet("get-by-admin")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<List<OrderDto>>> GetOrderByAdmin()
    {
        return await _context.Orders
        .Include(i=>i.OrderItems)
        .OrderToDto()
        .ToListAsync();
    }
    #endregion

    #region Get Order
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
    #endregion

    [HttpGet("stats")]
    public async Task<IActionResult> GetDashboardStats()
    {
        
    var stats = new
    {
        totalOrders = await _context.Orders.CountAsync(),
        todaysOrders = await _context.Orders
    .CountAsync(o => o.CreatedAt.HasValue &&
                     o.CreatedAt.Value.Date == DateTime.UtcNow.Date),
        totalUsers = await _context.Users.CountAsync(),
        pendingOrders = await _context.Orders
            .Where(o => o.OrderStatus == OrderStatus.Pending)
            .CountAsync(),
        totalRevenue = await _context.Orders
            .Where(o => o.OrderStatus == OrderStatus.Completed)
            .SumAsync(o => o.SubTotal + o.DeliveryFree)
    };

    return Ok(stats);
}

    #region Update Order Status
[HttpPatch("{id}/update-status")]
[Authorize(Roles = "Admin")]
public async Task<ActionResult> UpdateOrderStatus(int id, [FromBody] UpdateOrderStatusDto dto)
{
    var order = await _context.Orders.FindAsync(id);

    if (order == null) return NotFound();

    order.OrderStatus = (OrderStatus)dto.OrderStatus;

    var result = await _context.SaveChangesAsync() > 0;

    if (result) return NoContent();

    return BadRequest(new ProblemDetails { Title = "Problem updating order status" });
}
#endregion

    #region Create Order
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

        var items = new List<Entity.OrderItem>();

        foreach (var item in cart.CartItems)
        {
            var book = await _context.Books.FindAsync(item.BookId);

            var orderItem = new Entity.OrderItem
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

            var paymentResult = await ProcessPayment(createOrderDto, cart);
            
            if (paymentResult.Status == "failure")
            {
                return BadRequest(new ProblemDetails { Title = paymentResult.ErrorMessage });
            }

            order.ConversationId = paymentResult.ConversationId;
            order.BasketId = paymentResult.BasketId;

            _context.Orders.Add(order);
            _context.Carts.Remove(cart);

            var result = await _context.SaveChangesAsync() > 0;

            if(result)
                return CreatedAtAction(nameof(GetOrder), new {id = order.Id}, order.Id);
            
            return BadRequest(new ProblemDetails { Title = "Problem getting order" });
    }
    #endregion

    #region Process Payment
    private async Task<Payment> ProcessPayment(CreateOrderDto createOrderDto, Cart cart)
        {
            Options options = new Options();
            options.ApiKey = _config["PaymentAPI:APIKey"];
            options.SecretKey = _config["PaymentAPI:SecretKey"];

            options.BaseUrl = "https://sandbox-api.iyzipay.com";

            CreatePaymentRequest request = new CreatePaymentRequest();
            request.Locale = Locale.TR.ToString();
            request.ConversationId = Guid.NewGuid().ToString();
            request.Price = cart.CalculateTotal().ToString();
            request.PaidPrice = cart.CalculateTotal().ToString();
            request.Currency = Currency.TRY.ToString();
            request.Installment = 1;
            request.BasketId = cart.CartId.ToString();
            request.PaymentChannel = PaymentChannel.WEB.ToString();
            request.PaymentGroup = PaymentGroup.PRODUCT.ToString();

            PaymentCard paymentCard = new PaymentCard();
            paymentCard.CardHolderName = createOrderDto.CardName;
            paymentCard.CardNumber = createOrderDto.CardNumber;
            paymentCard.ExpireMonth = createOrderDto.CardExpireMonth;
            paymentCard.ExpireYear = createOrderDto.CardExpireYear;
            paymentCard.Cvc = createOrderDto.CardCvc;
            paymentCard.RegisterCard = 0;
            request.PaymentCard = paymentCard;

            Buyer buyer = new Buyer();
            buyer.Id = "BY789";
            buyer.Name = createOrderDto.FirstName;
            buyer.Surname = createOrderDto.LastName;
            buyer.GsmNumber = createOrderDto.Phone;
            buyer.Email = "email@email.com";
            buyer.IdentityNumber = "74300864791";
            buyer.LastLoginDate = "2015-10-05 12:43:35";
            buyer.RegistrationDate = "2013-04-21 15:12:09";
            buyer.RegistrationAddress = createOrderDto.AddresLine;
            buyer.Ip = "85.34.78.112";
            buyer.City = createOrderDto.City;
            buyer.Country = "Türkiye";
            buyer.ZipCode = "34732";
            request.Buyer = buyer;

            Address shippingAddress = new Address();
            shippingAddress.ContactName = createOrderDto.FirstName + " " + createOrderDto.LastName;
            shippingAddress.City = createOrderDto.City;
            shippingAddress.Country = "Türkiye";
            shippingAddress.Description = createOrderDto.AddresLine;
            shippingAddress.ZipCode = "34742";

            request.ShippingAddress = shippingAddress;
            request.BillingAddress = shippingAddress;

            List<BasketItem> basketItems = new List<BasketItem>();

            foreach (var item in cart.CartItems)
            {
                BasketItem basketItem = new BasketItem();
                basketItem.Id = item.BookId.ToString();
                basketItem.Name = item.Book.Title;
                basketItem.Category1 = "Saat";
                basketItem.ItemType = BasketItemType.PHYSICAL.ToString();
                basketItem.Price = (item.Book.Price * item.Quantity).ToString();
                basketItems.Add(basketItem);
            }

            request.BasketItems = basketItems;

            return await Payment.Create(request, options);
        }
    #endregion

    #region Get Total Order Count
    [HttpGet("count")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<int>> GetTotalOrderCount()
    {
        return await _context.Orders.CountAsync();
    }
    #endregion

    #region Get Today Orders
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
    #endregion

    #region Get Pending Orders
    [HttpGet("pending-orders")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<List<OrderDto>>> GetPendingOrders()
    {
        return await _context.Orders
            .Where(o => o.OrderStatus == 0)
            .OrderToDto()
            .ToListAsync();
    }
    #endregion
}