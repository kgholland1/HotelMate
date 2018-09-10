using System.ComponentModel.DataAnnotations;

namespace EPOS.API.Dtos
{
    public class ExtraForUpdateDto
    {
        public int Id { get; set; }

        [Required]
        public string ExtraName { get; set; }

        [Required]
        [Range(0, 50, ErrorMessage = "Unit Price must be between 0.00 (lowest) and 50.00 (highest).")]
        public decimal UnitPrice { get; set; }

        [Required]
        [MaxLength(150)]
        public string ExtraType { get; set; }    
    }
}