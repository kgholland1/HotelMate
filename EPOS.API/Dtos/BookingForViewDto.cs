using System;

namespace EPOS.API.Dtos
{
    public class BookingForViewDto
    {

        public int Id { get; set; }        
        public string GuestName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public DateTime CheckIn { get; set; }
        public string RoomNumber { get; set; }    
        public DateTime? CheckOut { get; set; }
        public string CheckOutBy { get; set; }       
        public DateTime UpdatedOn { get; set; }
        public string UpdatedBy { get; set; }
    }
}