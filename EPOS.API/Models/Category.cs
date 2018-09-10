using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace EPOS.API.Models
{
    public class Category
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(60)]
        public string HeaderName { get; set; }

        [Required]
        [MaxLength(150)]
        public string CatName { get; set; }
        public string Description { get; set; }        
        [Required]
        public int HotelId { get; set; }
        public  ICollection<Menu> Menus { get; set; }
    }
}