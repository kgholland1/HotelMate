using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EPOS.API.Dtos
{
    public class MenuOrderUpdateDto
    {
        public int Id { get; set; }        
        public string GuestName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string RoomNumber { get; set; }
        [Required]  
        [MaxLength(30)]
        public string OrderStatus { get; set; }
        [Required]        
        [StringLength(20)]
        public string OrderDate { get; set; }
        [Required]        
        [StringLength(30)]
        public string OrderTime { get; set; }
        public bool IsDeleted { get; set; }
        public string Request { get; set; }        
        public string Response { get; set; }
        [Column(TypeName = "decimal(10, 2)")]
        public decimal Total { get; set; }
        public bool Paid { get; set; }
        public string PaymentMethod { get; set; }
        [Column(TypeName = "decimal(10, 2)")]
        public decimal Discount { get; set; }
        public string PromotionCode { get; set; }
        [Column(TypeName = "decimal(10, 2)")]
        public decimal PaymentSurcharge { get; set; }
        public string PaymentGatewayID { get; set; }
        public DateTime CreatedOn { get; set; }
        public DateTime UpdatedOn { get; set; }
        public string UpdatedBy { get; set; }     
        public ICollection<MenuOrderDetailsDto> MenuOrderDetails { get; set; } = new List<MenuOrderDetailsDto>();        
    }
}