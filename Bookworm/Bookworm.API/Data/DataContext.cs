using Microsoft.EntityFrameworkCore;
using Bookworm.API.Entity;

namespace Bookworm.API.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options)
            : base(options)
        {
        }

        public DbSet<Category> Categories => Set<Category>();
        public DbSet<Book> Books => Set<Book>();
        public DbSet<Cart> Carts => Set<Cart>();

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
                    Price = 10.99m,
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
                    Price = 9.99m,
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
                    Price = 14.99m,
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
                    Price = 8.99m,
                    Stock = 120,
                    Description = "A dystopian novel about totalitarianism.",
                    IsActive = true,
                    ImgUrl = "4.jpg",
                    CategoryId = 2
                }
            );
        }
    }
}
