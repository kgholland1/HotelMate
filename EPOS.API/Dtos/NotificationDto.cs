namespace EPOS.API.Dtos
{
    public class NotificationDto
    {
        public int OrderCount { get; set; } 
        public int ReservationCount { get; set; } 
        public int HouseKeepingCount { get; set; } 
        public int TaxiCount { get; set; } 
        public int LuggageCount { get; set; } 
        public int WakeupCount { get; set; } 
        public int SPACount { get; set; }       
    }
}