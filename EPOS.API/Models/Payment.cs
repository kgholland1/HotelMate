using System.ComponentModel.DataAnnotations;

namespace EPOS.API.Models
{
    public class Payment
    {
        public int Id { get; set; }
        
        [Required]
        [MaxLength(80)]
        public string PaymentName { get; set; }

        [Required]
        public decimal Charge { get; set; }  
        public Hotel hotel { get; set; }
        public int HotelId { get; set; }          
    }
}