using System.ComponentModel.DataAnnotations;

namespace EPOS.API.Dtos
{
    public class CategoryForUpdateDto
    {

        public int Id { get; set; }

        [Required]
        [MaxLength(60)]
        public string HeaderName { get; set; }

        [Required]
        [MaxLength(150)]
        public string CatName { get; set; }
        public string Description { get; set; }           
    }
}