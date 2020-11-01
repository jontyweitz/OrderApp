using System.Collections.Generic;

namespace OrderApp.Domain.Restaurants
{
    public class Category
    {
        public string Name { get; set; }
        public List<MenuItem> MenuItems {get;set;}
    }
}
