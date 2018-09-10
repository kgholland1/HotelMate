using System.ComponentModel.DataAnnotations;

namespace EPOS.API.Models
{
    public class Reservation : AuditableEntity
    {
        public int Id { get; set; }
        public int NoOfPerson { get; set; }
        [StringLength(100)]
        public string GuestName { get; set; }
        [MaxLength(150)]
        public string Email { get; set; }
        [MaxLength(100)]
        public string RestaurantName { get; set; }
        [StringLength(30)]
        public string Phone { get; set; }
        [StringLength(50)]
        public string RoomNumber { get; set; }        
        [StringLength(30)]
        public string ResDate { get; set; }
        [StringLength(30)]
        public string ResTime { get; set; }
        [StringLength(50)]
        public string TypeName { get; set; }  
        public bool IsNew { get; set; }
        public bool IsDeleted { get; set; }
        [StringLength(10)]
        public string ResApproved { get; set; }
        public string Request { get; set; }        
        public string Feedback { get; set; }
        public int BookingId { get; set; }   
        public Booking booking {get; set; }        
        public int HotelId { get; set; }   
    }
}