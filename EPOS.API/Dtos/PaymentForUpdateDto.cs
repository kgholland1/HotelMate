using System.ComponentModel.DataAnnotations;

namespace EPOS.API.Dtos
{
    public class PaymentForUpdateDto
    {
        public int Id { get; set; }
        
        [Required]
        [MaxLength(80)]
        public string PaymentName { get; set; }

        [Required]
        [Range(0.00, double.MaxValue, ErrorMessage = "Please enter a positive number")]
        public decimal Charge { get; set; }  
      
    }
}