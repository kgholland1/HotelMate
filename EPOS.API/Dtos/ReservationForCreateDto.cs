using System.ComponentModel.DataAnnotations;

namespace EPOS.API.Dtos
{
    public class ReservationForCreateDto
    {
        [Required]
        public int NoOfPerson { get; set; }
        [Required]
        public string RestaurantName { get; set; }           
        [Required]
        public string ResDate { get; set; }
        [Required]        
        public string ResTime { get; set; }
        [Required]        
        public string TypeName { get; set; }  
        public string Request { get; set; }                 
    }
}