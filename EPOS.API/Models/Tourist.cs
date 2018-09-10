using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace EPOS.API.Models
{
    public class Tourist
    {
        public int Id { get; set; }
        
        [MaxLength(30)]
        public string TouristType { get; set; }        
        [Required]
        [MaxLength(80)]
        public string TourName { get; set; }
        [MaxLength(250)]
        public string Address { get; set; }

        public string TourDesc { get; set; }

        [MaxLength(25)]
        public string Phone { get; set; }    
        
        [MaxLength(150)]
        public string Email { get; set; }            
        [MaxLength(150)]
        public string Website { get; set; } 
        [Required]   
        [MaxLength(100)]
        public string Direction { get; set; }    
        [MaxLength(100)]
        public string Facebook { get; set; }   
        [MaxLength(70)]
        public string OtMonday { get; set; } 
        [MaxLength(70)]
        public string OtTuesday { get; set; } 
        [MaxLength(70)]
        public string OtWednesday { get; set; } 
        [MaxLength(70)]
        public string OtThursday { get; set; } 
        [MaxLength(70)]
        public string OtFriday { get; set; } 
        [MaxLength(70)]
        public string OtSaturday { get; set; } 
        [MaxLength(70)]
        public string OtSunday { get; set; } 
        [MaxLength(150)]
        public string OtMessage { get; set; }    
        public Hotel hotel { get; set; }
        public int HotelId { get; set; }                                                                  
    }
}