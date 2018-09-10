using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EPOS.API.Models
{
    public class Photo
    {
        
        public int Id { get; set; }
        [MaxLength(40)]
        public string PhotoType { get; set; }      
        public int PhotoTypeId { get; set; }        
        [MaxLength(150)]
        public string Url { get; set; }
        [MaxLength(250)]
        public string Description { get; set; }
        public DateTime DateAdded { get; set; }
        public bool IsMain { get; set; }
        public string PublicId { get; set; }

        [ForeignKey("HotelId")]
        public Hotel hotel { get; set; }
        public int HotelId { get; set; }
    }
}