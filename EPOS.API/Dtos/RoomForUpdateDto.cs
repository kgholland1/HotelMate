using System.ComponentModel.DataAnnotations;

namespace EPOS.API.Dtos
{
    public class RoomForUpdateDto
    {
        public int Id { get; set; }
        [Required]        
        public string RoomNo { get; set; }
        public string FloorNo { get; set; }        
        public string Building { get; set; }
        public string RoomDesc { get; set; }  
    }
}