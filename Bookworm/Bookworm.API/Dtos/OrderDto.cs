using Bookworm.API.Entity;

namespace Bookworm.API.Dtos;

public class OrderDto
{
    public int Id { get; set; }
        public DateTime OrderDate { get; set; } = DateTime.Now;
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Phone { get; set; }
        public string? City { get; set; }
        public string? AddresLine { get; set; }
        public string? CustomerId { get; set; }
        public OrderStatus OrderStatus { get; set; } = OrderStatus.Pending;
        public List<OrderItemDto> OrderItems { get; set; } = new();
        public decimal SubTotal { get; set; }
        public decimal DeliveryFree { get; set; }
        public string? TrackingNumber { get; set; }
}

public class OrderItemDto
    {
        public int Id { get; set; }
        public int OrderId { get; set; }
        public int BookId { get; set; }
        public string BookName { get; set; } = null!;
        public string BookImage { get; set; } = null!;
        public decimal Price { get; set; }
        public int Quantity { get; set; }
    }