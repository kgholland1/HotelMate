using System.ComponentModel.DataAnnotations;

namespace EPOS.API.Dtos
{
    public class TaxiForCreateDto
    {
        [Required]
        public int NoOfPerson { get; set; }
        [Required]
        public string ResDate { get; set; }
        [Required]
        public string ResTime { get; set; }
        [Required]
        public string Request { get; set; }        
 
    }
}