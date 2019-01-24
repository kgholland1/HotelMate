using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EPOS.API.Models
{
    public class Menu
    {
        public int Id { get; set; }

        [StringLength(60)]
        public string MenuCode { get; set; }

        public int MenuSortNumber { get; set; }

        [Required]
        [StringLength(120)]
        public string MenuName { get; set; }

        [StringLength(60)]
        public string MenuSubName { get; set; }
        public string ShortDesc { get; set; }
        public string MenuDesc { get; set; }
        
        [Column(TypeName = "decimal(10, 2)")]
        public decimal UnitPrice { get; set; }

        public int MenuImageType { get; set; }
        public bool ShowExtras { get; set; }
        public Hotel hotel { get; set; }
        public int HotelId { get; set; }
        public Category Category { get; set; }
        public int CategoryId { get; set; }
        public ICollection<MenuExtra> MenuExtras { get; set; }

        public Menu()
        {
            MenuExtras = new Collection<MenuExtra>();
        }
    }
}