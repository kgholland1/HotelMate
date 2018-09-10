using System.ComponentModel.DataAnnotations;

namespace EPOS.API.Models
{
    public class CatHeader
    {
        public int Id { get; set; }
        
        [Required]
        [MaxLength(60)]
        public string HeaderName { get; set; }
        
    }
}