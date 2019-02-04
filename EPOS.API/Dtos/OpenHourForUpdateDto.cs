using System.ComponentModel.DataAnnotations;

namespace EPOS.API.Dtos
{
    public class OpenHourForUpdateDto
    {
        public int Id { get; set; }        
        [Required]
        public string Type { get; set; }
        [Required]
        public string TypeName { get; set; }  
        public string Restaurant { get; set; }  
        [Required]
        public string Start { get; set; } 
        [Required]       
        public string End { get; set; }   
        [Required]
        public string Interval { get; set; }             
    }
}