namespace EPOS.API.Models
{
    public class Notification
    {
        public int Id { get; set; }
        public int HotelId { get; set; }
        public int OrderCount { get; set; } = 0;
        public int ReservationCount { get; set; } = 0;
        public int HouseKeepingCount { get; set; } = 0;
        public int TaxiCount { get; set; } = 0;
        public int LuggageCount { get; set; } = 0;
        public int WakeupCount { get; set; } = 0;
        public int SPACount { get; set; } = 0;
        public Notification(int hotelId)
        {
            HotelId = hotelId;

        }
    }

}