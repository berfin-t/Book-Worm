using Bookworm.API.Entity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Bookworm.API.Data
{
    public class DataContext : IdentityDbContext<AppUser, AppRole, string>
    {
        public DataContext(DbContextOptions<DataContext> options)
            : base(options)
        {
        }

        public DbSet<Category> Categories => Set<Category>();
        public DbSet<Book> Books => Set<Book>();
        public DbSet<Cart> Carts => Set<Cart>();
        public DbSet<Order> Orders => Set<Order>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Category>()
                .HasMany(c => c.Books)
                .WithOne(b => b.Category)
                .HasForeignKey(b => b.CategoryId);

            modelBuilder.Entity<Category>().HasData(
                new Category { Id = 1, Name = "Fiction" },
                new Category { Id = 2, Name = "Science Fiction" },
                new Category { Id = 3, Name = "Non-Fiction" }
            );

            modelBuilder.Entity<Book>().HasData(
                new Book
                {
                    Id = 1,
                    Title = "The Great Gatsby",
                    Author = "F. Scott Fitzgerald",
                    Isbn = "9780743273565",
                    Price = 100.99m,
                    Stock = 100,
                    Description = "A novel set in the Roaring Twenties.",
                    IsActive = true,
                    ImgUrl = "2.jpg",
                    CategoryId = 1
                },
                new Book
                {
                    Id = 2,
                    Title = "Dune",
                    Author = "Frank Herbert",
                    Isbn = "9780441013593",
                    Price = 90.99m,
                    Stock = 50,
                    Description = "A science fiction novel about politics and power.",
                    IsActive = true,
                    ImgUrl = "3.jpg",
                    CategoryId = 2
                },
                new Book
                {
                    Id = 3,
                    Title = "Sapiens: A Brief History of Humankind",
                    Author = "Yuval Noah Harari",
                    Isbn = "9780062316097",
                    Price = 140.99m,
                    Stock = 75,
                    Description = "A book exploring the history and impact.",
                    IsActive = false,
                    ImgUrl = "1.jpg",
                    CategoryId = 3
                },
                new Book
                {
                    Id = 4,
                    Title = "1984",
                    Author = "George Orwell",
                    Isbn = "9780451524935",
                    Price = 80.99m,
                    Stock = 120,
                    Description = "A dystopian novel about totalitarianism.",
                    IsActive = true,
                    ImgUrl = "4.jpg",
                    CategoryId = 2
                },
                new Book
                {
                    Id = 5,
                    Title = "To Kill a Mockingbird",
                    Author = "Harper Lee",
                    Isbn = "9780061120084",
                    Price = 110.99m,
                    Stock = 90,
                    Description = "A novel about racial injustice in the Deep South.",
                    IsActive = true,
                    ImgUrl = "5.jpg",
                    CategoryId = 1
                },
                new Book
                {
                    Id = 6,
                    Title = "Educated",
                    Author = "Tara Westover",
                    Isbn = "9780399590504",
                    Price = 130.99m,
                    Stock = 60,
                    Description = "A memoir about a young woman's journey from an isolated upbringing to a college education.",
                    IsActive = true,
                    ImgUrl = "6.jpg",
                    CategoryId = 3
                },
                new Book
                {
                    Id = 7,
                    Title = "Brave New World",  
                    Author = "Aldous Huxley",
                    Isbn = "9780060850524",
                    Price = 120.99m,
                    Stock = 80,
                    Description = "A dystopian novel about a future society.",
                    IsActive = true,
                    ImgUrl = "7.jpg",
                    CategoryId = 2
                }, new Book
                {
                    Id = 8,
                    Title = "The Catcher in the Rye",
                    Author = "J.D. Salinger",
                    Isbn = "9780316769488",
                    Price = 105.99m,
                    Stock = 110,
                    Description = "A novel about a teenager's journey through adolescence.",
                    IsActive = true,
                    ImgUrl = "8.jpg",
                    CategoryId = 1
                }
            );
        }
    }
}
