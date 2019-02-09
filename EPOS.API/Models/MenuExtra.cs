using System.ComponentModel.DataAnnotations.Schema;

namespace EPOS.API.Models
{
    public class MenuExtra
    {
        public int MenuId { get; set; }
        public Menu Menu { get; set; }
        public int ExtraId { get; set; }
        public Extra Extra { get; set; }    
        public string ExtraName { get; set; }
        [Column(TypeName = "decimal(10, 2)")]
        public decimal UnitPrice { get; set; }
        public string ExtraType { get; set; }    
    }
}