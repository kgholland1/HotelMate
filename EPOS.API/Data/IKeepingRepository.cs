using System.Threading.Tasks;
using EPOS.API.Helpers;
using EPOS.API.Models;

namespace EPOS.API.Data
{
    public interface IKeepingRepository
    {
        void Add<T>(T entity) where T: class;
        void Delete<T>(T entity) where T: class;    
        Task<PagedList<Taxi>> GetTaxis(TaxiParam taxiParam, int HotelID);   
        Task<Taxi> GetTaxi(int Id);  
        Task<OpenTime> GetOpenTimes(int HotelId, string type, string typeName);    
        Task<PagedList<Luggage>> GetLuggages(LuggageParam luggageParam, int HotelID); 
        Task<Luggage> GetLuggage(int Id);
        Task<PagedList<WakeUp>> GetWakeups(WakeParam wakeParam, int HotelID);
        Task<WakeUp> GetWake(int Id);
    }
}