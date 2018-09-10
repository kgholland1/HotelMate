using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EPOS.API.Models
{
    public class Note
    {
        public int Id { get; set; }
        
        [MaxLength(1000)]
        public string Notes { get; set; }
        public DateTime CreatedOn { get; set; }
        public string CreatedBy { get; set; }
        [ForeignKey("BookingId")]
        public Booking booking { get; set; }
        public int BookingId { get; set; }               
    }
}