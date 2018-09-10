using System.ComponentModel.DataAnnotations;

namespace EPOS.API.Dtos
{
    public class RestaurantForUpdateDto
    {
        public int Id { get; set; }
        
        [Required]
        [MaxLength(100)]
        public string RestaurantName { get; set; }
    }
}