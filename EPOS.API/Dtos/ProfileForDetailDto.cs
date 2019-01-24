using System;

namespace EPOS.API.Dtos
{
    public class ProfileForDetailDto
    {
        public string Email { get; set; }
        public string FullName { get; set; }
        public string PhoneNumber { get; set; }        
        public string Department { get; set; }
        public string Position { get; set; }                 
        public string HotelName { get; set; }       
        public string HotelCode { get; set; }        
        public DateTime Created { get; set; }
        public DateTime LastActive { get; set; }        
    }
}