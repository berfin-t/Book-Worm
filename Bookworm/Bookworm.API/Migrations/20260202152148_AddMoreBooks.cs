using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Bookworm.API.Migrations
{
    /// <inheritdoc />
    public partial class AddMoreBooks : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Books",
                columns: new[] { "Id", "Author", "CategoryId", "Description", "ImgUrl", "IsActive", "Isbn", "Price", "Stock", "Title" },
                values: new object[,]
                {
                    { 5, "Harper Lee", 1, "A novel about racial injustice in the Deep South.", "5.jpg", true, "9780061120084", 110.99m, 90, "To Kill a Mockingbird" },
                    { 6, "Tara Westover", 3, "A memoir about a young woman's journey from an isolated upbringing to a college education.", "6.jpg", true, "9780399590504", 130.99m, 60, "Educated" },
                    { 7, "Aldous Huxley", 2, "A dystopian novel about a future society.", "7.jpg", true, "9780060850524", 120.99m, 80, "Brave New World" },
                    { 8, "J.D. Salinger", 1, "A novel about a teenager's journey through adolescence.", "8.jpg", true, "9780316769488", 105.99m, 110, "The Catcher in the Rye" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Books",
                keyColumn: "Id",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "Books",
                keyColumn: "Id",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "Books",
                keyColumn: "Id",
                keyValue: 7);

            migrationBuilder.DeleteData(
                table: "Books",
                keyColumn: "Id",
                keyValue: 8);
        }
    }
}
