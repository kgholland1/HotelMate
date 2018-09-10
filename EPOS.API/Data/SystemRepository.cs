using System.Linq;
using System.Threading.Tasks;
using EPOS.API.Helpers;
using EPOS.API.Models;
using Microsoft.EntityFrameworkCore;

namespace EPOS.API.Data
{
    public class SystemRepository : ISystemRepository
    {
        private readonly DataContext _context;
        public SystemRepository(DataContext context)
        {
            _context = context;
        }
        public void Add<T>(T entity) where T : class
        {
            _context.Add(entity);
        }

        public void Delete<T>(T entity) where T : class
        {
            _context.Remove(entity);
        }

        public async Task<Payment> GetPayment(int id)
        {
            var payment = await _context.Payments.FirstOrDefaultAsync(e => e.Id == id);

            return payment;      
        }

        public async Task<PagedList<Payment>> GetPayments(GeneralParams paymentParams, int hotelId)
        {
            var payments =  _context.Payments.Where(u => u.HotelId == hotelId).OrderBy(u => u.PaymentName).AsQueryable();

            return await PagedList<Payment>.CreateAsync(payments, paymentParams.PageNumber, paymentParams.PageSize);
        }
        public async Task<PagedList<Restaurant>> GetRestaurants(GeneralParams restaurantParams, int hotelId)
        {
            var restaurants =  _context.Restaurants.Where(u => u.HotelId == hotelId).OrderBy(u => u.RestaurantName).AsQueryable();

            return await PagedList<Restaurant>.CreateAsync(restaurants, restaurantParams.PageNumber, restaurantParams.PageSize);
        } 
        public async Task<Restaurant> GetRestaurant(int id)
        {
            var restaurant = await _context.Restaurants.FirstOrDefaultAsync(e => e.Id == id);

            return restaurant;      
        }  
        public async Task<PagedList<OpenTime>> GetOpenHours(GeneralParams openHourParams, int hotelId)
        {
            var openHours =  _context.OpenTimes.Where(u => u.HotelId == hotelId).OrderBy(u => u.Type).AsQueryable();

            return await PagedList<OpenTime>.CreateAsync(openHours, openHourParams.PageNumber, openHourParams.PageSize);
        }  
        public async Task<OpenTime> GetOpenHour(int id)
        {
            var openHour = await _context.OpenTimes.FirstOrDefaultAsync(e => e.Id == id);

            return openHour;      
        }                          
    }
}