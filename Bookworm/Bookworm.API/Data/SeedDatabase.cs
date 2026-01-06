using Bookworm.API.Entity;
using BookWorm.API.Entity;
using Microsoft.AspNetCore.Identity;

namespace Bookworm.API.Data
{
    public class SeedDatabase
    {
        public static async void Initialize(IApplicationBuilder app)
        {
            var userManager = app.ApplicationServices
            .CreateScope()
                .ServiceProvider.
                GetRequiredService<UserManager<AppUser>>();

            var roleManager = app.ApplicationServices
            .CreateScope()
                .ServiceProvider.
                GetRequiredService<RoleManager<AppRole>>();

            if (!roleManager.Roles.Any())
            {
                var customer = new AppRole { Name = "Customer" };
                var admin = new AppRole { Name = "Admin" };

                await roleManager.CreateAsync(customer);
                await roleManager.CreateAsync(admin);
            }

            if (!userManager.Users.Any())
            {
                var customer = new AppUser
                {
                    Name = "Customer One",
                    UserName = "customer1",
                    Email = "customer1@mail.com"
                };
                await userManager.CreateAsync(customer, "Customer_1");
                await userManager.AddToRoleAsync(customer, "Customer");

                var admin = new AppUser
                {
                    Name = "Berfin Tek",
                    UserName = "berfintek",
                    Email = "berfintek@mail.com"
                };
                await userManager.CreateAsync(admin, "Admin_1");
                await userManager.AddToRolesAsync(admin, ["Admin", "Customer"]);
            }
        }
    }
}