using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using EPOS.API.Helpers;
using EPOS.API.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.ObjectModel;

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
        public async Task<User> GetUser(int userID, bool includeHotel = true)
        {

            if (includeHotel) {
                return await _context.Users.Include(h => h.hotel).FirstOrDefaultAsync(e => e.Id == userID);                
            } else {
                return await _context.Users.FirstOrDefaultAsync(e => e.Id == userID);
            }     

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

        public async Task<Hotel> HotelSignup(Hotel hotel) {

            var newHotel = hotel;
            _context.Add(newHotel);
            await _context.SaveChangesAsync();

            return newHotel;
        }

        public async Task<bool> CreateNotificationCounters(int hotelId)
        {
            var item = new Notification(hotelId);
            _context.Add(item);

            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<Notification> GetNotificationCounters(int hotelId)
        {
            return await _context.Notifications.FirstOrDefaultAsync(e => e.HotelId == hotelId);       
        }
        
        public async Task<DashboardSummary> GetSummaryCounters(int hotelId)
        {
            DashboardSummary counters = new DashboardSummary()
               {Orders = 0, Reservations = 0, Bookings = 0, Keepings = 0} 
            ;
            DateTime startDate = DateTime.Now.Date; 
            DateTime endDate = startDate.AddHours(23).AddMinutes(59).AddSeconds(59);            

            counters.Orders = await _context.MenuOrders.CountAsync(o => o.HotelId == hotelId
                && o.CreatedOn >= startDate && o.CreatedOn <= endDate); 

            counters.Reservations = await _context.Reservations.CountAsync(o => o.HotelId == hotelId
                && o.CreatedOn >= startDate && o.CreatedOn <= endDate); 

            counters.Bookings = await _context.Bookings.CountAsync(o => o.HotelId == hotelId
                && o.CreatedOn >= startDate && o.CreatedOn <= endDate); 

            counters.Keepings = await _context.Taxis.CountAsync(o => o.HotelId == hotelId
                && o.CreatedOn >= startDate && o.CreatedOn <= endDate); 

            return counters;       
        }
        
        public async Task<DashboardOrderGraph> GetOrdersGraph(int hotelId)
        {
            DashboardOrderGraph orderGraph = new DashboardOrderGraph();
            List<GraphResult> dateCount = new List<GraphResult>();
            string[] labelArray = new string[31];


            DateTime startDate = DateTime.Now.AddDays(-30).Date; 
            DateTime endDate = DateTime.Now.Date.AddHours(23).AddMinutes(59).AddSeconds(59);    

            orderGraph.selectedPeriod = startDate.ToShortDateString() + " - " +  endDate.ToShortDateString();


            var Orders = await _context.Bookings.Where(o => o.HotelId == hotelId
                && o.CreatedOn >= startDate && o.CreatedOn <= endDate).ToListAsync(); 

            foreach(var line in Orders.GroupBy(info => info.CreatedOn.Date)
                                    .Select(group => new { 
                                        OrderDate = group.Key, 
                                        OrderCount = group.Count() 
                                    })
                                    .OrderBy(x => x.OrderDate))
                                    {
                                        dateCount.Add(new GraphResult() { OrderDate = line.OrderDate.ToShortDateString(), 
                                        OrderCount = line.OrderCount });
                                    }

            // create the labels and counts
            for (int i = 0; i < 31; i++)
            {
                var currentDate = startDate.AddDays(i).Date.ToShortDateString();
                var FoundinList = dateCount.Find(x => x.OrderDate.Contains(currentDate));

                orderGraph.DataLabels[i] = startDate.AddDays(i).Day.ToString();

                if (FoundinList != null){
                    orderGraph.DataCounters[i] = FoundinList.OrderCount;
                } else {
                   orderGraph.DataCounters[i] = 0;
                }
            }         
            
            return orderGraph;       
        }
        public async Task<List<MenuOrder>> GetLatestOrders(int hotelId)
        {
            return await  _context.MenuOrders.Where(h => h.HotelId == hotelId)
                    .OrderByDescending(b => b.CreatedOn).Take(5).ToListAsync();
     
        }
        public async Task<List<Taxi>> GetLatestHouseKeeping(int hotelId)
        {
            return await  _context.Taxis.Where(h => h.HotelId == hotelId  && h.BookStatus != "Cancelled")
                    .OrderByDescending(b => b.CreatedOn).Take(5).ToListAsync();
     
        }
    }
}