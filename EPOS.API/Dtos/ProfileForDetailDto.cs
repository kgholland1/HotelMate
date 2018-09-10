using System;

namespace EPOS.API.Dtos
{
    public class ProfileForDetailDto
    {
        public string Username { get; set; }
        public string Email { get; set; }
        public string OldEmail { get; set; }        
        public string HotelName { get; set; }       
        public string HotelCode { get; set; }        
        public DateTime Created { get; set; }
        public DateTime LastActive { get; set; }        
    }
}