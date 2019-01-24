using System;

namespace EPOS.API.Dtos
{
    public class UserForSuccessfulDto
    {
        public int Id { get; set; }        
        public string Username { get; set; }        
        public string Email { get; set; }
        public int HotelId { get; set; }
            
    }
}