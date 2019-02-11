using System.Collections.Generic;
using System.Threading.Tasks;
using EPOS.API.Dtos;
using EPOS.API.Helpers;
using EPOS.API.Models;

namespace EPOS.API.Data
{
    public interface IMenuRepository
    {
        void Add<T>(T entity) where T: class;
        void Delete<T>(T entity) where T: class;
        Task<PagedList<Extra>> GetExtras(ExtraParams extraParams, int HotelID);
        Task<Extra> GetExtra(int id);
        Task<List<CatHeader>> GetCatHeaders();
        Task<Category> GetCategory(int id);
        Task<PagedList<Category>> GetCategories(CategoryParams categoryParams, int HotelID);
        Task<IEnumerable<KeyValuePairDto>> GetCatKeyValuePair(int hotelId);
         Task<IEnumerable<KeyValuePairDto>> GetExtraKeyValuePair(int hotelId);
        Task<Hotel> GetHotelWithCode(string hotelcode); 
        Task<PagedList<Menu>> GetMenus(CategoryParams categoryParams, int HotelID);
        Task<Menu> GetMenu(int id, bool includeRelated = true);
        Task<int> GetMenusByCategory(int categoryid);
        Task<List<Extra>> GetExtrasForMenu(int hotelID);
        Task<MenuOrder> GetMenuOrder(int id);
        Task<PagedList<MenuOrder>> GetRoomOrders(OrderParam orderParam, int HotelID);
    }
}