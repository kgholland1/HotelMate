using System.Threading.Tasks;
using EPOS.API.Helpers;
using EPOS.API.Models;
using System.Collections.Generic;

namespace EPOS.API.Data
{
    public interface IHotelRepository
    {
        void Add<T>(T entity) where T: class;
        void Delete<T>(T entity) where T: class;
        Task<Hotel> GetHotelWithCode(string hotelcode);            
        Task<bool> HotelExists(string hotelname);
        Task<User> GetUser(int userID);   
        Task<Hotel> GetHotel(int id, bool includePhotos = false);
        Task<Hotel> GetHotelWithJustHotelPhotos(int id);
        Task<IEnumerable<Photo>> GetPhotosForType(int id, int hotelId, string photoType);
        Task<PagedList<Room>> GetRooms(GeneralParams roomParams, int HotelID); 
        Task<Room> GetRoom(int id);  
        Task<Photo> GetPhoto(int id);
        Task<Photo> GetMainPhotoForType(int hotelId, string photoType, int photoTypeId);
        Task<PagedList<Tourist>> GetTourists(GeneralParams touristParams, int HotelID);
        Task<Tourist> GetTourist(int id);
    }
}