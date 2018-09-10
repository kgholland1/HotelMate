using System;
using System.Collections.Generic;

namespace EPOS.API.Dtos
{
    public class HotelForUpdatesDto
    {
        public int Id { get; set; }

        public string HotelName { get; set; }
        
        public string HotelCode { get; set; }
        public string Introduction { get; set; }
        public string History { get; set; }

        public string Address1 { get; set; }

        public string Address2 { get; set; }
        public string Town { get; set; }
        public string County { get; set; }

        public string Country { get; set; }
        public string PostCode { get; set; }
        public string Phone { get; set; }    
    
        public string Email { get; set; }            

        public string Website { get; set; }      
        public DateTime CreatedOn { get; set; }

        public string CreatedBy { get; set; }
        public DateTime UpdatedOn { get; set; }
        public string UpdatedBy { get; set; }       
        public ICollection<PhotoForReturnDto> Photos { get; set; }
    }
}