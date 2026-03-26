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
            await SeedComments(context);
            await SeedRatings(context);
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

            var customer2 = new AppUser
            {
                Name = "Customer User2",
                UserName = "customer2",
                Email = "customer2@mail.com"
            };

            await userManager.CreateAsync(customer2, "Customer_1");
            await userManager.AddToRoleAsync(customer2, "Customer");
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

        // ---------------- COMMENTS ----------------
private static async Task SeedComments(DataContext context)
{
    if (context.Comments.Any()) return;

    var books = await context.Books.ToListAsync();
    var users = await context.Users.ToListAsync();

    if (!books.Any() || !users.Any()) return;

    var customer1 = users.FirstOrDefault(u => u.UserName == "customer");
    var customer2 = users.FirstOrDefault(u => u.UserName == "customer2");

    var comments = new List<Comment>
    {
        // 1984
        new Comment { Content = "A dystopian masterpiece, truly terrifying.", Book = books.FirstOrDefault(b => b.Title == "1984"), User = customer1 },
        new Comment { Content = "Big Brother is watching. Unforgettable.", Book = books.FirstOrDefault(b => b.Title == "1984"), User = customer2 },

        // Animal Farm
        new Comment { Content = "A brilliant political allegory.", Book = books.FirstOrDefault(b => b.Title == "Animal Farm"), User = customer1 },
        new Comment { Content = "Short but incredibly powerful.", Book = books.FirstOrDefault(b => b.Title == "Animal Farm"), User = customer2 },

        // Pride and Prejudice
        new Comment { Content = "A timeless classic that everyone should read.", Book = books.FirstOrDefault(b => b.Title == "Pride and Prejudice"), User = customer1 },
        new Comment { Content = "Austen's wit and charm shine throughout.",Book = books.FirstOrDefault(b => b.Title == "Pride and Prejudice"), User = customer2 },
        // Crime and Punishment
        new Comment { Content = "A gripping tale of crime and morality.",Book = books.FirstOrDefault(b => b.Title == "Crime and Punishment"), User = customer1 },
        new Comment { Content = "Dostoevsky's psychological depth is unmatched.",Book = books.FirstOrDefault(b => b.Title == "Crime and Punishment"), User = customer2 },

        // Harry Potter
        new Comment { Content = "A magical journey that captivates readers of all ages.", Book = books.FirstOrDefault(b => b.Title == "Harry Potter and the Sorcerer's Stone"), User = customer1 },
        new Comment { Content = "The beginning of an epic series!", Book = books.FirstOrDefault(b => b.Title == "Harry Potter and the Sorcerer's Stone"), User = customer2 },
        // The Shining
        new Comment { Content = "Terrifying and brilliantly written.", Book = books.FirstOrDefault(b => b.Title == "The Shining"), User = customer1 },
        new Comment { Content = "King at his absolute best.", Book = books.FirstOrDefault(b => b.Title == "The Shining"), User = customer2 },
    };

    context.Comments.AddRange(comments);
    await context.SaveChangesAsync();
    }

    // ---------------- RATINGS ----------------
    private static async Task SeedRatings(DataContext context)
    {
        if (context.Ratings.Any()) return;
        var books = await context.Books.ToListAsync();
        var users = await context.Users.ToListAsync();
        if (!books.Any() || !users.Any()) return;

        var customer1 = users.FirstOrDefault(u => u.UserName == "customer");
        var customer2 = users.FirstOrDefault(u => u.UserName == "customer2");

        var ratings = new List<Rating>
        {
            // 1984
            new Rating { Score = 5, Book = books.FirstOrDefault(b => b.Title == "1984"), User = customer1 },
            new Rating { Score = 4, Book = books.FirstOrDefault(b => b.Title == "1984"), User = customer2 },

            // Animal Farm
            new Rating { Score = 5, Book = books.FirstOrDefault(b => b.Title == "Animal Farm"), User = customer1 },
            new Rating { Score = 4, Book = books.FirstOrDefault(b => b.Title == "Animal Farm"), User = customer2 },

            // Pride and Prejudice
            new Rating { Score = 5, Book = books.FirstOrDefault(b => b.Title == "Pride and Prejudice"), User = customer1 },
            new Rating { Score = 5, Book = books.FirstOrDefault(b => b.Title == "Pride and Prejudice"), User = customer2 },
            // Crime and Punishment
            new Rating { Score = 5, Book = books.FirstOrDefault(b => b.Title == "Crime and Punishment"), User = customer1 },
            new Rating { Score = 4, Book = books.FirstOrDefault(b => b.Title == "Crime and Punishment"), User = customer2 },

            // Harry Potter
            new Rating { Score = 5, Book = books.FirstOrDefault(b => b.Title == "Harry Potter and the Sorcerer's Stone"), User = customer1 },
            new Rating { Score = 5, Book = books.FirstOrDefault(b => b.Title == "Harry Potter and the Sorcerer's Stone"), User = customer2 },
            // The Shining
            new Rating { Score = 5, Book = books.FirstOrDefault(b => b.Title == "The Shining"), User = customer1 },
            new Rating { Score = 4, Book = books.FirstOrDefault(b => b.Title == "The Shining"), User = customer2 },
        };

        context.Ratings.AddRange(ratings);
        await context.SaveChangesAsync();
    }

    // ---------------- BOOKS ----------------
    private static async Task SeedBooks(DataContext context)
    {
        if (context.Books.Any()) return;

            var authors = await context.Authors.ToListAsync();
            var categories = await context.Categories.ToListAsync();

            if (!authors.Any() || !categories.Any()) return;

            var orwell = authors.FirstOrDefault(a => a.Name == "George Orwell");
            var austen = authors.FirstOrDefault(a => a.Name == "Jane Austen");
            var dostoevsky = authors.FirstOrDefault(a => a.Name == "Fyodor Dostoevsky");
            var rowling = authors.FirstOrDefault(a => a.Name == "J.K. Rowling");
            var king = authors.FirstOrDefault(a => a.Name == "Stephen King");
            var fiction = categories.FirstOrDefault(c => c.Name == "Fiction");
            var sciFi = categories.FirstOrDefault(c => c.Name == "Science Fiction");

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
