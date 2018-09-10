using System.ComponentModel.DataAnnotations;

namespace EPOS.API.Models
{
    public class Restaurant
    {
        public int Id { get; set; }
        
        [Required]
        [MaxLength(100)]
        public string RestaurantName { get; set; }
        public Hotel hotel { get; set; }
        public int HotelId { get; set; }        
    }
}