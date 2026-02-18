using Bookworm.API.Entity;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Bookworm.API.Data
{
    public static class SeedDatabase
    {
        public static async Task InitializeAsync(WebApplication app)
        {
            using var scope = app.Services.CreateScope();

            var context = scope.ServiceProvider.GetRequiredService<DataContext>();
            var userManager = scope.ServiceProvider.GetRequiredService<UserManager<AppUser>>();
            var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<AppRole>>();
            var env = scope.ServiceProvider.GetRequiredService<IWebHostEnvironment>();

            await context.Database.MigrateAsync();

            if (!env.IsDevelopment())
                return;

            await SeedRoles(roleManager);
            await SeedUsers(userManager);
            await SeedCategories(context);
            await SeedAuthors(context);
            await SeedBooks(context);
        }

        // ---------------- ROLES ----------------
        private static async Task SeedRoles(RoleManager<AppRole> roleManager)
        {
            if (roleManager.Roles.Any()) return;

            await roleManager.CreateAsync(new AppRole { Name = "Admin" });
            await roleManager.CreateAsync(new AppRole { Name = "Customer" });
        }

        // ---------------- USERS ----------------
        private static async Task SeedUsers(UserManager<AppUser> userManager)
        {
            if (userManager.Users.Any()) return;

            var admin = new AppUser
            {
                Name = "Admin User",
                UserName = "admin",
                Email = "admin@mail.com"
            };

            await userManager.CreateAsync(admin, "Admin_1");
            await userManager.AddToRoleAsync(admin, "Admin");

            var customer = new AppUser
            {
                Name = "Customer User",
                UserName = "customer",
                Email = "customer@mail.com"
            };

            await userManager.CreateAsync(customer, "Customer_1");
            await userManager.AddToRoleAsync(customer, "Customer");
        }

        // ---------------- CATEGORIES ----------------
        private static async Task SeedCategories(DataContext context)
        {
            if (context.Categories.Any()) return;

            var categories = new List<Category>
            {
                new Category { Name = "Fiction" },
                new Category { Name = "Science Fiction" },
                new Category { Name = "Non-Fiction" }
            };

            context.Categories.AddRange(categories);
            await context.SaveChangesAsync();
        }

        // ---------------- AUTHORS ----------------
        private static async Task SeedAuthors(DataContext context)
        {
            if (context.Authors.Any()) return;

            var authors = new List<Author>
            {
                new Author 
                { 
                    Name = "George Orwell", 
                    Bio = "English novelist and essayist.",
                    ImgUrl = "/images/authors/orwell.jpg"
                },
                new Author 
                { 
                    Name = "Jane Austen", 
                    Bio = "English novelist known for realism.",
                    ImgUrl = "/images/authors/austen.jpg"
                },
                new Author 
                { 
                    Name = "Fyodor Dostoevsky", 
                    Bio = "Russian novelist and philosopher.",
                    ImgUrl = "/images/authors/dostoevsky.jpg"
                },
                new Author 
                { 
                    Name = "J.K. Rowling", 
                    Bio = "British author, Harry Potter series.",
                    ImgUrl = "/images/authors/rowling.jpg"
                },
                new Author 
                { 
                    Name = "Stephen King", 
                    Bio = "American horror novelist.",
                    ImgUrl = "/images/authors/king.jpg"
                }
            };

            context.Authors.AddRange(authors);
            await context.SaveChangesAsync();
        }

        // ---------------- BOOKS ----------------
        private static async Task SeedBooks(DataContext context)
        {
            if (context.Books.Any()) return;

            var authors = await context.Authors.ToListAsync();
            var categories = await context.Categories.ToListAsync();

            if (!authors.Any() || !categories.Any()) return;

            var orwell = authors.First(a => a.Name == "George Orwell");
            var austen = authors.First(a => a.Name == "Jane Austen");
            var dostoevsky = authors.First(a => a.Name == "Fyodor Dostoevsky");
            var rowling = authors.First(a => a.Name == "J.K. Rowling");
            var king = authors.First(a => a.Name == "Stephen King");

            var fiction = categories.First(c => c.Name == "Fiction");
            var sciFi = categories.First(c => c.Name == "Science Fiction");

            var books = new List<Book>
            {
                new Book 
                { 
                    Title = "1984",
                    Isbn = "9780451524935",
                    Description = "A novel set in the Roaring Twenties.",
                    ImgUrl = "https://covers.openlibrary.org/b/isbn/9780451524935-L.jpg",
                    Author = orwell,
                    Category = sciFi,
                    Price = 120,
                    Stock = 50,
                    IsActive = true
                },
                new Book 
                { 
                    Title = "Animal Farm",
                    Isbn = "9780451526342",
                    Description = "A novel set in the Roaring Twenties.",
                    ImgUrl = "https://covers.openlibrary.org/b/isbn/9780451526342-L.jpg",
                    Author = orwell,
                    Category = fiction,
                    Price = 90,
                    Stock = 70,
                    IsActive = true
                },
                new Book 
                { 
                    Title = "Pride and Prejudice",
                    Isbn = "9780141439518",
                    Description = "A novel set in the Roaring Twenties.",
                    ImgUrl = "https://covers.openlibrary.org/b/isbn/9780141439518-L.jpg",
                    Author = austen,
                    Category = fiction,
                    Price = 110,
                    Stock = 60,
                    IsActive = true
                },
                new Book 
                { 
                    Title = "Crime and Punishment",
                    Isbn = "9780140449136",
                    Description = "A novel set in the Roaring Twenties.",
                    ImgUrl = "https://covers.openlibrary.org/b/isbn/9780140449136-L.jpg",
                    Author = dostoevsky,
                    Category = fiction,
                    Price = 150,
                    Stock = 30,
                    IsActive = true
                },
                new Book 
                { 
                    Title = "Harry Potter and the Sorcerer's Stone",
                    Isbn = "9780439708180",
                    Description = "A novel set in the Roaring Twenties.",
                    ImgUrl = "https://covers.openlibrary.org/b/isbn/9780439708180-L.jpg",
                    Author = rowling,
                    Category = sciFi,
                    Price = 180,
                    Stock = 100,
                    IsActive = true
                },
                new Book 
                { 
                    Title = "The Shining",
                    Isbn = "9780307743657",
                    Description = "A novel set in the Roaring Twenties.",
                    ImgUrl = "https://covers.openlibrary.org/b/isbn/9780307743657-L.jpg",
                    Author = king,
                    Category = fiction,
                    Price = 140,
                    Stock = 60,
                    IsActive = true
                }
            };

            context.Books.AddRange(books);
            await context.SaveChangesAsync();
        }
    }
}
