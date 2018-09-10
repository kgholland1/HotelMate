using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel.DataAnnotations;

namespace EPOS.API.Dtos
{
    public class MenuForSaveDto
    {
        public int Id { get; set; }
        [Required]
        public int CategoryId { get; set; }
        public string MenuCode { get; set; }
        public int MenuSortNumber { get; set; }
        [Required]
        public string MenuName { get; set; }
        public string MenuSubName { get; set; }
        public string ShortDesc { get; set; }
        public string MenuDesc { get; set; }        
        [Required]
        public decimal UnitPrice { get; set; }
        public int MenuImageType { get; set; }      
        public bool ShowExtras { get; set; }   
        public ICollection<int> MenuExtras { get; set; } =new Collection<int>();                       
    }
}