using System.ComponentModel.DataAnnotations;

namespace EPOS.API.Models
{
    public class Luggage : AuditableEntity
    {
        public int Id { get; set; }
        public int NoOfLuggage { get; set; }
        [StringLength(100)]
        public string GuestName { get; set; }
        [MaxLength(150)]
        public string Email { get; set; }
        [StringLength(30)]
        public string Phone { get; set; }
        [StringLength(50)]
        public string RoomNumber { get; set; }        
        [StringLength(30)]
        public string ResDate { get; set; }
        [StringLength(30)]
        public string ResTime { get; set; }
        [StringLength(50)]
        public bool IsDeleted { get; set; }
        [StringLength(20)]
        public string BookStatus { get; set; }
        public string Request { get; set; }        
        public string Response { get; set; }
        public int BookingId { get; set; }   
        public Booking booking {get; set; }        
        public int HotelId { get; set; }                  
    }
}