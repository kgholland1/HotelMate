using System.Collections.Generic;
using System.Threading.Tasks;
using EPOS.API.Helpers;
using EPOS.API.Models;

namespace EPOS.API.Data
{
    public interface IBookingRepository
    {
        void Add<T>(T entity) where T: class;
        void Delete<T>(T entity) where T: class;    
        Task<PagedList<Booking>> GetBookings(BookingParam bookingParam, int HotelID);  
        Task<Booking> GetBooking(int id);  
        Task<Booking> GuestCurrentBooking(int GuestId);
        Task<List<Note>> GetNotes(int bookingId);
        Task<Note> GetNote(int id);
        Task<PagedList<Reservation>> GetReservations(ReservationParam reservationParam, int HotelID);
        Task<Reservation> GetReservation(int Id);
        Task<OpenTime> GetOpenTimes(int HotelId, string type, string typeName);
    }
}