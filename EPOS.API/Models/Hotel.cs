using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace EPOS.API.Models
{
    public class Hotel : AuditableEntity
    {
        public int Id { get; set; }
        
        [MaxLength(160)]
        public string HotelName { get; set; }
        
        [MaxLength(30)]
        public string HotelCode { get; set; }
        public string Introduction { get; set; }
        public string History { get; set; }
        [MaxLength(80)]
        public string Address1 { get; set; }

        [MaxLength(80)]
        public string Address2 { get; set; }

        [MaxLength(40)]
        public string Town { get; set; }

        [MaxLength(40)]
        public string County { get; set; }
        [MaxLength(40)]
        public string Country { get; set; }

        [MaxLength(15)]
        public string PostCode { get; set; }

        [MaxLength(25)]
        public string Phone { get; set; }    
        
        [MaxLength(150)]
        public string Email { get; set; }            
        [MaxLength(150)]
        public string Website { get; set; }     
        public ICollection<User> Users { get; set; }   
        public ICollection<Photo> Photos { get; set; } = new List<Photo>();  
    }
}