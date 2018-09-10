using System.Threading.Tasks;
using EPOS.API.Helpers;
using EPOS.API.Models;

namespace EPOS.API.Data
{
    public interface ISystemRepository
    {
        void Add<T>(T entity) where T: class;
        void Delete<T>(T entity) where T: class;
        Task<PagedList<Payment>> GetPayments(GeneralParams paymentParams, int hotelId);
        Task<Payment> GetPayment(int id);
        Task<PagedList<Restaurant>> GetRestaurants(GeneralParams restaurantParams, int hotelId);
        Task<Restaurant> GetRestaurant(int id);
        Task<PagedList<OpenTime>> GetOpenHours(GeneralParams openHourParams, int hotelId);
        Task<OpenTime> GetOpenHour(int id);
    }
}