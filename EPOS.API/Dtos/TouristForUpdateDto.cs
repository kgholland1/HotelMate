namespace EPOS.API.Dtos
{
    public class TouristForUpdateDto
    {
        public int Id { get; set; }
        
        public string TouristType { get; set; }        

        public string TourName { get; set; }

        public string Address { get; set; }

        public string TourDesc { get; set; }

        public string Phone { get; set; }    
        
        public string Email { get; set; }            

        public string Website { get; set; } 

        public string Direction { get; set; }    

        public string Facebook { get; set; }   

        public string OtMonday { get; set; } 

        public string OtTuesday { get; set; } 

        public string OtWednesday { get; set; } 

        public string OtThursday { get; set; } 

        public string OtFriday { get; set; } 

        public string OtSaturday { get; set; } 

        public string OtSunday { get; set; } 

        public string OtMessage { get; set; }   
        public int HotelId { get; set; }    
    }
}