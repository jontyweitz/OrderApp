using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using OrderApp.DataAccess.Restaurants;
using OrderApp.Domain.Restaurants;

namespace OrderApp
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var webHost = CreateWebHostBuilder(args).Build();
            var restaurantRepository = webHost.Services.GetService(typeof(IRestaurantRepository)) as RestaurantRepository;
            if(restaurantRepository != null)
            {
                restaurantRepository.LoadJson();
            }            
            webHost.Run();
        }

        public static IWebHostBuilder CreateWebHostBuilder(string[] args) =>
            WebHost.CreateDefaultBuilder(args)
                .UseStartup<Startup>();
    }
}
