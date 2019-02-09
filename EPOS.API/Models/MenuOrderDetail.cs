using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EPOS.API.Models
{
    public class MenuOrderDetail
    {
        public int Id { get; set; }        
        public int MenuOrderId { get; set; }  
        
        public MenuOrder MenuOrder { get; set; }   
        public int MenuID { get; set; } 
        public string MenuName { get; set; }

        [Column(TypeName = "decimal(10, 2)")]
        public decimal Price { get; set; }
        public string DishRequest { get; set; }  
        public int MenuCount { get; set; }
        public string Options { get; set; }
        public string Extras { get; set; }        
        public string OptionKeys { get; set; }
        public string ExtraKeys { get; set; }        
    
    }
}