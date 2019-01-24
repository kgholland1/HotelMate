using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EPOS.API.Models
{
    public class Extra
    {
        public int Id { get; set; }
        
        [Required]
        [MaxLength(150)]
        public string ExtraName { get; set; }
        
        [Required]
        [Column(TypeName = "decimal(10, 2)")]
        public decimal UnitPrice { get; set; }
        
        [Required]
        [MaxLength(150)]
        public string ExtraType { get; set; }
        public Hotel hotel { get; set; }
        public int HotelId { get; set; }
        public  ICollection<MenuExtra> MenuExtras { get; set; }
    }
}