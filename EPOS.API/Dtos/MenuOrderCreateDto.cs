using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace EPOS.API.Dtos
{
    public class MenuOrderCreateDto
    {
        [Required]        
        public string OrderDate { get; set; }
        [Required]        
        public string OrderTime { get; set; }
        public string Request { get; set; }        
        public decimal Total { get; set; }
        public bool Paid { get; set; }
        public string PaymentMethod { get; set; }
        public decimal Discount { get; set; }
        public string PromotionCode { get; set; }
        public decimal PaymentSurcharge { get; set; }
        public ICollection<MenuOrderDetailsDto> MenuOrderDetails { get; set; } = new List<MenuOrderDetailsDto>();      
    }
}