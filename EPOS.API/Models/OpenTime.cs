using System.ComponentModel.DataAnnotations;

namespace EPOS.API.Models
{
    public class OpenTime
    {
        public int Id { get; set; }        
        [Required]
        [MaxLength(30)]
        public string Type { get; set; }
        [Required]
        public string TypeName { get; set; }  
        public string Start { get; set; } 
        public string End { get; set; }   
        public string Interval { get; set; }            
        public Hotel hotel { get; set; }
        public int HotelId { get; set; }            
    }
}