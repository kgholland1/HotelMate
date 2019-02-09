using System.Threading.Tasks;
using EPOS.API.Helpers;
using EPOS.API.Models;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System;
using System.Collections.Generic;

namespace EPOS.API.Data
{
    public class KeepingRepository : IKeepingRepository
    {
        private readonly DataContext _context;
        public KeepingRepository(DataContext context)
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

        public async Task<PagedList<Taxi>> GetTaxis(TaxiParam taxiParam, int HotelID)
        {
            var taxis =  _context.Taxis.Where(h => h.HotelId == HotelID  && h.IsDeleted == false)
                .OrderBy(b => b.Id).AsQueryable();

            if (!taxiParam.All) {
                if (!string.IsNullOrEmpty(taxiParam.Status)) {
                   
                    if (taxiParam.Status == "Pending,Processing")               
                        taxis = taxis.Where(b => b.BookStatus == "Pending" || b.BookStatus == "Processing"); 
                    else
                        taxis = taxis.Where(b => b.BookStatus == taxiParam.Status); 
                }
                if (!string.IsNullOrEmpty(taxiParam.RoomNumber)) {
                    taxis = taxis.Where(b => b.RoomNumber == taxiParam.RoomNumber);                
                }

                if (!string.IsNullOrEmpty(taxiParam.Fullname)) {
                    taxis = taxis.Where(b => b.GuestName.Contains(taxiParam.Fullname));                
                }

                if (!string.IsNullOrEmpty(taxiParam.Email)) {
                    taxis = taxis.Where(b => b.Email.Contains(taxiParam.Email));                
                }            

                if (!string.IsNullOrEmpty(taxiParam.Phone)) {
                    taxis = taxis.Where(b => b.Phone.Contains(taxiParam.Phone));                
                }  

                if (!string.IsNullOrEmpty(taxiParam.BookingDate)) {
                    DateTime dt;
                    if (DateTime.TryParse(taxiParam.BookingDate, out dt)) {
                        taxis = taxis.Where(b => DateTime.Parse(b.ResDate).ToShortDateString() == dt.ToShortDateString());                          
                    }         
                } 
            }
            else
            {
                taxis = taxis.Where(b => b.CreatedOn > DateTime.Now.AddMonths(-1));    
            }

            if (!string.IsNullOrEmpty(taxiParam.OrderBy))
            {
                switch (taxiParam.OrderBy)
                {
                    case "Created":
                        taxis = taxis.OrderBy(b => b.CreatedOn);
                        break;
                    default:
                        taxis = taxis.OrderBy(b => (DateTime.Parse(b.ResDate + " " + b.ResTime)));
                        break;
                }
            }

            return await PagedList<Taxi>.CreateAsync(taxis, taxiParam.PageNumber, taxiParam.PageSize);
        }
        public async Task<Taxi> GetTaxi(int Id)
        {
           var taxi = await _context.Taxis.FirstOrDefaultAsync(e => e.Id == Id);

            return taxi;        

        }   
        public async Task<OpenTime> GetOpenTimes(int HotelId, string type, string typeName)
        {
            var openTimes = await _context.OpenTimes
                .FirstOrDefaultAsync(e => e.HotelId == HotelId && e.Type == type && e.TypeName.Contains(typeName));

            return openTimes;        
        }  
        public async Task<PagedList<Luggage>> GetLuggages(LuggageParam luggageParam, int HotelID)
        {
            var luggages =  _context.Luggages.Where(h => h.HotelId == HotelID  && h.IsDeleted == false)
                .OrderBy(b => b.Id).AsQueryable();

            if (!luggageParam.All) {
                if (!string.IsNullOrEmpty(luggageParam.Status)) {
                   
                    if (luggageParam.Status == "Pending,Processing")               
                        luggages = luggages.Where(b => b.BookStatus == "Pending" || b.BookStatus == "Processing"); 
                    else
                        luggages = luggages.Where(b => b.BookStatus == luggageParam.Status); 
                }
                if (!string.IsNullOrEmpty(luggageParam.RoomNumber)) {
                    luggages = luggages.Where(b => b.RoomNumber == luggageParam.RoomNumber);                
                }

                if (!string.IsNullOrEmpty(luggageParam.Fullname)) {
                    luggages = luggages.Where(b => b.GuestName.Contains(luggageParam.Fullname));                
                }

                if (!string.IsNullOrEmpty(luggageParam.Email)) {
                    luggages = luggages.Where(b => b.Email.Contains(luggageParam.Email));                
                }            

                if (!string.IsNullOrEmpty(luggageParam.Phone)) {
                    luggages = luggages.Where(b => b.Phone.Contains(luggageParam.Phone));                
                }  

                if (!string.IsNullOrEmpty(luggageParam.BookingDate)) {
                    DateTime dt;
                    if (DateTime.TryParse(luggageParam.BookingDate, out dt)) {
                        luggages = luggages.Where(b => DateTime.Parse(b.ResDate).ToShortDateString() == dt.ToShortDateString());                          
                    }         
                } 
            }
            else
            {
                luggages = luggages.Where(b => b.CreatedOn > DateTime.Now.AddMonths(-1));    
            }

            if (!string.IsNullOrEmpty(luggageParam.OrderBy))
            {
                switch (luggageParam.OrderBy)
                {
                    case "Created":
                        luggages = luggages.OrderBy(b => b.CreatedOn);
                        break;
                    default:
                        luggages = luggages.OrderBy(b => (DateTime.Parse(b.ResDate).ToShortDateString() + " " + b.ResTime));
                        break;
                }
            }

            return await PagedList<Luggage>.CreateAsync(luggages, luggageParam.PageNumber, luggageParam.PageSize);
        }    
        public async Task<Luggage> GetLuggage(int Id)
        {
           var luggage = await _context.Luggages.FirstOrDefaultAsync(e => e.Id == Id);

            return luggage;        

        }
        public async Task<PagedList<WakeUp>> GetWakeups(WakeParam wakeParam, int HotelID)
        {
            var wakeups =  _context.WakeUps.Where(h => h.HotelId == HotelID  && h.IsDeleted == false)
                .OrderBy(b => b.Id).AsQueryable();

            if (!wakeParam.All) {
                if (!string.IsNullOrEmpty(wakeParam.Status)) {
                   
                    if (wakeParam.Status == "Pending,Processing")               
                        wakeups = wakeups.Where(b => b.BookStatus == "Pending" || b.BookStatus == "Processing"); 
                    else
                        wakeups = wakeups.Where(b => b.BookStatus == wakeParam.Status); 
                }
                if (!string.IsNullOrEmpty(wakeParam.RoomNumber)) {
                    wakeups = wakeups.Where(b => b.RoomNumber == wakeParam.RoomNumber);                
                }

                if (!string.IsNullOrEmpty(wakeParam.Fullname)) {
                    wakeups = wakeups.Where(b => b.GuestName.Contains(wakeParam.Fullname));                
                }

                if (!string.IsNullOrEmpty(wakeParam.Email)) {
                    wakeups = wakeups.Where(b => b.Email.Contains(wakeParam.Email));                
                }            

                if (!string.IsNullOrEmpty(wakeParam.Phone)) {
                    wakeups = wakeups.Where(b => b.Phone.Contains(wakeParam.Phone));                
                }  

                if (!string.IsNullOrEmpty(wakeParam.BookingDate)) {
                    DateTime dt;
                    if (DateTime.TryParse(wakeParam.BookingDate, out dt)) {
                        wakeups = wakeups.Where(b => DateTime.Parse(b.ResDate).ToShortDateString() == dt.ToShortDateString());                          
                    }         
                } 
            }
            else
            {
                wakeups = wakeups.Where(b => b.CreatedOn > DateTime.Now.AddMonths(-1));    
            }

            if (!string.IsNullOrEmpty(wakeParam.OrderBy))
            {
                switch (wakeParam.OrderBy)
                {
                    case "Created":
                        wakeups = wakeups.OrderBy(b => b.CreatedOn);
                        break;
                    default:
                        wakeups = wakeups.OrderBy(b => (DateTime.Parse(b.ResDate).ToShortDateString() + " " + b.ResTime));
                        break;
                }
            }

            return await PagedList<WakeUp>.CreateAsync(wakeups, wakeParam.PageNumber, wakeParam.PageSize);
        }   
        public async Task<WakeUp> GetWake(int Id)
        {
           var wake = await _context.WakeUps.FirstOrDefaultAsync(e => e.Id == Id);

            return wake;        

        }                               
    }
}