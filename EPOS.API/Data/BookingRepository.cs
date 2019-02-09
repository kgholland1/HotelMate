using System.Threading.Tasks;
using EPOS.API.Helpers;
using EPOS.API.Models;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System;
using System.Collections.Generic;

namespace EPOS.API.Data
{
    public class BookingRepository : IBookingRepository
    {
        private readonly DataContext _context;

        public BookingRepository(DataContext context)
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
        public async Task<PagedList<Booking>> GetBookings(BookingParam bookingParam, int HotelID)
        {
            var bookings =  _context.Bookings.Where(h => h.HotelId == HotelID && h.IsMain == true && h.IsDeleted == false)
                .OrderBy(b => b.Id).AsQueryable();

            if (!bookingParam.All) {
                if (!string.IsNullOrEmpty(bookingParam.RoomNumber)) {
                    bookings = bookings.Where(b => b.RoomNumber == bookingParam.RoomNumber);                
                }

                if (!string.IsNullOrEmpty(bookingParam.Fullname)) {
                    bookings = bookings.Where(b => b.GuestName.Contains(bookingParam.Fullname));                
                }

                if (!string.IsNullOrEmpty(bookingParam.Email)) {
                    bookings = bookings.Where(b => b.Email.Contains(bookingParam.Email));                
                }            

                if (!string.IsNullOrEmpty(bookingParam.CheckInDate)) {
                    DateTime dt;
                    if (DateTime.TryParse(bookingParam.CheckInDate, out dt)) {
                        bookings = bookings.Where(b => b.CheckIn.ToShortDateString() == dt.ToShortDateString());                          
                    }         
                } 
            }

            if (!string.IsNullOrEmpty(bookingParam.OrderBy))
            {
                switch (bookingParam.OrderBy)
                {
                    case "CheckIn":
                        bookings = bookings.OrderByDescending(b => b.CheckIn);
                        break;
                    default:
                        bookings = bookings.OrderBy(b => b.GuestName);
                        break;
                }
            }

            return await PagedList<Booking>.CreateAsync(bookings, bookingParam.PageNumber, bookingParam.PageSize);
        }  
        public async Task<Booking> GetBooking(int id)
        {
            var booking = await _context.Bookings.FirstOrDefaultAsync(e => e.Id == id);

            return booking;        
        } 
        public async Task<Booking> GuestCurrentBooking(int GuestId)
        {
            var booking = await _context.Bookings
                .FirstOrDefaultAsync(e => e.GuestId == GuestId && e.IsMain == true 
                && e.IsDeleted == false && e.CheckOut == null);

            return booking;        
        }         
        public async Task<List<Note>> GetNotes(int bookingId)
        {
            var notes = await _context.Notes
                .Where(e => e.BookingId == bookingId)
                .OrderBy(o => o.Id)
                .ToListAsync();

            return notes;        
        } 
        public async Task<Note> GetNote(int id)
        {
            var note = await _context.Notes.FirstOrDefaultAsync(e => e.Id == id);

            return note;        
        } 
        public async Task<PagedList<Reservation>> GetReservations(ReservationParam reservationParam, int HotelID)
        {
            var reservations =  _context.Reservations.Where(h => h.HotelId == HotelID  
                && h.IsDeleted == false )
                .OrderBy(b => b.Id).AsQueryable();

            if (!reservationParam.All) {
                if (reservationParam.IsNew) {
                    reservations = reservations.Where(b => b.IsNew == true &&  b.IsCompleted == false);                
                }
                if (!string.IsNullOrEmpty(reservationParam.RoomNumber)) {
                    reservations = reservations.Where(b => b.RoomNumber == reservationParam.RoomNumber);                
                }

                if (!string.IsNullOrEmpty(reservationParam.Fullname)) {
                    reservations = reservations.Where(b => b.GuestName.Contains(reservationParam.Fullname));                
                }

                if (!string.IsNullOrEmpty(reservationParam.Email)) {
                    reservations = reservations.Where(b => b.Email.Contains(reservationParam.Email));                
                }            

                if (!string.IsNullOrEmpty(reservationParam.Phone)) {
                    reservations = reservations.Where(b => b.Phone.Contains(reservationParam.Phone));                
                }  

                if (!string.IsNullOrEmpty(reservationParam.ReservationDate)) {
                    DateTime dt;
                    if (DateTime.TryParse(reservationParam.ReservationDate, out dt)) {
                        reservations = reservations.Where(b => DateTime.Parse(b.ResDate).ToShortDateString() == dt.ToShortDateString());                          
                    }         
                } 
            }
            else
            {
                reservations = reservations.Where(b => b.CreatedOn > DateTime.Now.AddMonths(-1));    
            }

            if (!string.IsNullOrEmpty(reservationParam.OrderBy))
            {
                switch (reservationParam.OrderBy)
                {
                    case "Created":
                        reservations = reservations.OrderBy(b => b.CreatedOn);
                        break;
                    case "Restaurant":
                        reservations = reservations.OrderBy(b => b.RestaurantName);
                        break;                                               
                    default:
                         reservations = reservations.OrderBy(b => (DateTime.Parse(b.ResDate + " " + b.ResTime)));
                        break;
                }
            }

            return await PagedList<Reservation>.CreateAsync(reservations, reservationParam.PageNumber, reservationParam.PageSize);
        } 
        
        public async Task<OpenTime> GetOpenTimes(int HotelId, string type, string typeName)
        {
            var openTimes = await _context.OpenTimes
                .FirstOrDefaultAsync(e => e.HotelId == HotelId && e.Type == type && e.TypeName.Contains(typeName));

            return openTimes;        
        }   
        public async Task<Reservation> GetReservation(int Id)
        {
           var reservation = await _context.Reservations.FirstOrDefaultAsync(e => e.Id == Id);

            return reservation;        

        }                   
    }
}