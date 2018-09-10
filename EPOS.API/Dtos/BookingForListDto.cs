using System;

namespace EPOS.API.Dtos
{
    public class BookingForListDto
    {
        public int Id { get; set; }        
        public string GuestName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public DateTime CheckIn { get; set; }
        public string RoomNumber { get; set; }        
    }
}