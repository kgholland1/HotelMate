using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EPOS.API.Models
{
    public class Booking : AuditableEntity
    {
        public int Id { get; set; }        
        [Required]
        public int GuestId { get; set; }
        [MaxLength(100)]
        public string GuestName { get; set; }
        [MaxLength(150)]
        public string Email { get; set; }
        public string Phone { get; set; }
        public DateTime CheckIn { get; set; }
        public DateTime? CheckOut { get; set; }
        public string CheckOutBy { get; set; }
        public string RoomNumber { get; set; }
        public bool IsMain { get; set; }
        public bool IsDeleted { get; set; }
        
        [ForeignKey("HotelId")]
        public Hotel hotel { get; set; }
        public int HotelId { get; set; }      
        public ICollection<Note> Notes { get; set; } = new List<Note>();    
    }
}