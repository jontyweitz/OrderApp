using System.Collections.Generic;

namespace OrderApp.Domain.Restaurants
{
    public interface IRestaurantRepository
    {
        IEnumerable<Restaurant> SearchRestaurants(string menuItem, string location);
    }
}
