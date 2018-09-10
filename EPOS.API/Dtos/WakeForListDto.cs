using System;

namespace EPOS.API.Dtos
{
    public class WakeForListDto
    {
        public int Id { get; set; }
        public string GuestName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string RoomNumber { get; set; }        
        public string ResDate { get; set; }
        public string ResTime { get; set; }
        public string BookStatus { get; set; }
        public DateTime CreatedOn { get; set; }        
    }
}