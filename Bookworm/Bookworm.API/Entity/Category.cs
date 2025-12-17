using System;
using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;
using Bookworm.API.Entity;

namespace Bookworm.API.Data
{

    public class Category
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;

        public ICollection<Book> Books { get; set; } = new List<Book>();
    }
}
