using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using EPOS.API.Helpers;
using EPOS.API.Models;
using Microsoft.EntityFrameworkCore;

namespace EPOS.API.Data
{
    public class HotelRepository : IHotelRepository
    {
        private readonly DataContext _context;

        public HotelRepository(DataContext context)
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
        public async Task<Hotel> GetHotelWithCode(string hotelcode)
        {
            var hotel = await _context.Hotels.FirstOrDefaultAsync(e => e.HotelCode == hotelcode);

            return hotel;        
        }
        public async Task<bool> HotelExists(string hotelcode)
        {
            if (await _context.Hotels.AnyAsync(x => x.HotelCode == hotelcode))
                return true;
            
            return false;
        }
        public async Task<User> GetUser(int userID)
        {
           var user = await _context.Users.FirstOrDefaultAsync(e => e.Id == userID);

            return user;        

        }

        public async Task<PagedList<Room>> GetRooms(GeneralParams roomParams, int HotelID)
        {
            var rooms =  _context.Rooms.Where(u => u.HotelId == HotelID).OrderBy(u => u.RoomNo).AsQueryable();

            return await PagedList<Room>.CreateAsync(rooms, roomParams.PageNumber, roomParams.PageSize);
        }

        public async Task<Hotel> GetHotel(int id, bool includePhotos = false)
        {
            if (includePhotos)
            {
                return await _context.Hotels.Include(p => p.Photos)
                    .FirstOrDefaultAsync(h => h.Id == id);
            }
            else
            {
                return await _context.Hotels.FirstOrDefaultAsync(e => e.Id == id);
            }
         }
        public async Task<Hotel> GetHotelWithJustHotelPhotos(int id)
        {
            var photos = await _context.Photos.Where(p => p.HotelId == id && p.PhotoType == "Hotel").ToListAsync();

            var hotel =  await _context.Hotels.FirstOrDefaultAsync(h => h.Id == id);

            hotel.Photos  = photos;
               

            return hotel;

        }
        public async Task<IEnumerable<Photo>> GetPhotosForType(int id, int hotelId, string photoType)
        {
            var photos = await _context.Photos.Where(p => p.HotelId == hotelId 
                && p.PhotoType == photoType && p.PhotoTypeId == id ).ToListAsync();

            return photos;

        }        
        public async Task<Photo> GetPhoto(int id)
        {
            var photo = await _context.Photos.FirstOrDefaultAsync(p => p.Id == id);

            return photo;
        }
        public async Task<Photo> GetMainPhotoForType(int hotelId, string photoType, int photoTypeId)
        {
            return await _context.Photos.Where(u => u.HotelId == hotelId && u.PhotoType == photoType 
                && u.PhotoTypeId == photoTypeId)
                .FirstOrDefaultAsync(p => p.IsMain);
        }
        
        public async Task<Room> GetRoom(int id)
        {
            return await _context.Rooms.FirstOrDefaultAsync(e => e.Id == id);       
        }

        public async Task<PagedList<Tourist>> GetTourists(GeneralParams touristParams, int HotelID)
        {
            var tourists =  _context.Tourists.Where(u => u.HotelId == HotelID).OrderBy(u => u.TouristType).AsQueryable();

            return await PagedList<Tourist>.CreateAsync(tourists, touristParams.PageNumber, touristParams.PageSize);
        }

        public async Task<Tourist> GetTourist(int id)
        {
            return await _context.Tourists.FirstOrDefaultAsync(e => e.Id == id);       
        }
    }
}