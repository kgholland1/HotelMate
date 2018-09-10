using System.ComponentModel.DataAnnotations;

namespace EPOS.API.Models
{
    public class Room
    {
        public int Id { get; set; }
        
        [Required]
        [MaxLength(50)]
        public string RoomNo { get; set; }

        [MaxLength(40)]
        public string FloorNo { get; set; }        
        
        [MaxLength(60)]
        public string Building { get; set; }
        
        [MaxLength(300)]
        public string RoomDesc { get; set; }

        public Hotel hotel { get; set; }
        public int HotelId { get; set; }
    
    }
}