using Bookworm.API.Dtos;
using Bookworm.API.Entity;

namespace Bookworm.API.Extensions;

public static class OrderExtensions
    {
        public static IQueryable<OrderDto> OrderToDto(this IQueryable<Order> query)
        {
            return query.Select(i => new OrderDto
            {
                Id = i.Id,
                CustomerId = i.CustomerId,
                FirstName = i.FirstName,
                LastName = i.LastName,
                Phone = i.Phone,
                AddresLine = i.AddresLine,
                City = i.City,
                DeliveryFree = i.DeliveryFree,
                SubTotal = i.SubTotal,
                OrderDate = i.OrderDate,
                OrderStatus = i.OrderStatus,
                OrderItems = i.OrderItems.Select(item => new OrderItemDto
                {
                    Id = item.Id,
                    BookName = item.BookName,
                    BookId = item.BookId,
                    BookImage = item.BookImage,
                    Price = item.Price,
                    Quantity = item.Quantity
                }).ToList()
            });
        }
    }