using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using OrderApp.Domain.Restaurants;

namespace OrderApp.Controllers
{
    [Route("api/[controller]")]
    public class RestaurantController : Controller
    {
        private readonly IRestaurantRepository restaurantRepository;

        public RestaurantController(IRestaurantRepository restaurantRepository)
        {
            this.restaurantRepository = restaurantRepository;
        }

        [HttpGet("search")]
        public IEnumerable<Restaurant> Search([FromQuery]string searchTerms = "")
        {
            var terms = searchTerms.Replace(" in ", " ").Split(' ').ToList();
            var menuItem = terms[0] ?? "";
            if (terms.Count > 0)
            {
                terms.RemoveAt(0);
            }
            return restaurantRepository.SearchRestaurants(menuItem, string.Join(' ', terms));
        }     
    }
}
