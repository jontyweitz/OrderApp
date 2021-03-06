﻿using OrderApp.Domain.Restaurants;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.Json;

namespace OrderApp.DataAccess.Restaurants
{
    public class RestaurantRepository : IRestaurantRepository
    {
        private List<Restaurant> restaurants;

        public void LoadJson()
        {
            using StreamReader r = new StreamReader("SampleData.json");
            string json = r.ReadToEnd();
            restaurants = JsonSerializer.Deserialize<List<Restaurant>>(json);
        }

        public IEnumerable<Restaurant> SearchRestaurants(string menuItemTerm, string location)
        {           
            var matches = restaurants.Where(res => (string.IsNullOrEmpty(location) || string.Equals(res.City, location, StringComparison.InvariantCultureIgnoreCase))
            && (res.Categories.Where(category => string.IsNullOrEmpty(menuItemTerm) || category.Name.Contains(menuItemTerm, StringComparison.InvariantCultureIgnoreCase)
                || category.MenuItems.Where(menuItem =>  menuItem.Name.Contains(menuItemTerm, StringComparison.InvariantCultureIgnoreCase)).Any()).Any()));

            return matches.Select(restaurant => new Restaurant()
            {
                Id = restaurant.Id,
                Name = restaurant.Name,
                Suburb = restaurant.Suburb,
                LogoPath = restaurant.LogoPath,
                Rank = restaurant.Rank,
                Categories = restaurant.Categories.Where(category => string.IsNullOrEmpty(menuItemTerm) || category.Name.Contains(menuItemTerm, StringComparison.InvariantCultureIgnoreCase)
                || category.MenuItems.Where(menuItem => menuItem.Name.Contains(menuItemTerm, StringComparison.InvariantCultureIgnoreCase)).Any())
                .Select(category => new Category
                {
                    Name = category.Name,
                    MenuItems = string.IsNullOrEmpty(menuItemTerm) || category.Name.Contains(menuItemTerm, StringComparison.InvariantCultureIgnoreCase)
                    ? category.MenuItems
                    : category.MenuItems.Where(menuItem => string.IsNullOrEmpty(menuItemTerm) || menuItem.Name.Contains(menuItemTerm, StringComparison.InvariantCultureIgnoreCase))
                        .Select(menuItem => new MenuItem
                        {
                            Id = menuItem.Id,
                            Name = menuItem.Name,
                            Price = menuItem.Price
                        }).ToList()
                }).ToList()
            }).OrderByDescending(restaurant => restaurant.Categories.Sum(category => category.MenuItems.Count()))
            .ThenBy(restaurant => restaurant.Rank);
        }
    }
}
