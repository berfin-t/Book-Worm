using Bookworm.API.Entity;

namespace Bookworm.API.Entity;

public class Cart
{
    public int CartId { get; set; }
    public string CustomerId { get; set; } = null!;
    public List<CartItem> CartItems { get; set; } = new();

    public void AddItem(Book book, int quantity)
    {
        var item = CartItems.Where(c => c.BookId == book.Id).FirstOrDefault();

        if(item == null)
        {
            CartItems.Add(new CartItem { BookId = book.Id, Quantity = quantity });
        }
        else
        {
            item.Quantity += quantity;
        }
    }

    public void DeleteItem(int bookId, int quantity)
    {
        var item = CartItems.Where(c => c.BookId == bookId).FirstOrDefault();
        if (item == null) return;

        item.Quantity -= quantity;
        if (item.Quantity == 0)
        {
            CartItems.Remove(item);
        }
    }

    public double CalculateTotal()
    {
        return (double)CartItems.Sum(i => (i.Book.Price ?? 0) * i.Quantity);
    }
}

public class CartItem
{
    public int CartItemId { get; set; }

    public int BookId { get; set; }
    public Book Book { get; set; } = null!;

    public int CartId { get; set; }
    public int Quantity { get; set; }
}