using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Collections.Generic;
using System.Collections.ObjectModel;

namespace EPOS.API.Models
{
    public class MenuOrder : AuditableEntity
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
        public string SortingTime { get; set; }
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
        public int BookingId { get; set; }   
        public Booking booking {get; set; } 
        public int HotelId { get; set; }     
        public ICollection<MenuOrderDetail> MenuOrderDetails { get; set; } = new List<MenuOrderDetail>();     
    }
}