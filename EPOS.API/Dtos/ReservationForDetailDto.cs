using System;

namespace EPOS.API.Dtos
{
    public class ReservationForDetailDto
    {
        public int Id { get; set; }
        public int NoOfPerson { get; set; }
        public string GuestName { get; set; }
        public string Email { get; set; }
        public string RestaurantName { get; set; }
        
        public string Phone { get; set; }
        public string RoomNumber { get; set; }        
        public string ResDate { get; set; }
        public string ResTime { get; set; }
        public string TypeName { get; set; }  
        public string ResApproved { get; set; }
        public string Request { get; set; }        
        public string Feedback { get; set; }
        public DateTime CreatedOn { get; set; }
        public DateTime UpdatedOn { get; set; }
        public string UpdatedBy { get; set; }       
    }
}