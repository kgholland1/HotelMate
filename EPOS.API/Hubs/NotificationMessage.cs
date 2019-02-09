using System.Collections.Generic;
using System.Threading.Tasks;
using EPOS.API.Dtos;
using EPOS.API.Models;

namespace EPOS.API.Hubs
{
    public class NotificationMessage 
    {
        public int HotelId { get; set; }
        public string Message { get; set; }
        public NotificationDto NotificationCounters { get; set; }
        public NotificationMessage(int hotelId, string message, NotificationDto counters)
        {
            HotelId = hotelId;
            NotificationCounters = counters;
            Message = message;

        }
        public static NotificationMessage CreateNotification(int hotelId, string status, string roomNumber, NotificationDto counters)
        {
            var message = "";

            switch (status)
            {
                case "Order":
                    message = $"New order for room {roomNumber}.";
                    break;
                case "Reservation":
                    message = $"Table reservation for room {roomNumber}.";
                    break;                                               
                case "HouseKeeping":
                    message = $"New House keeping for room {roomNumber}.";
                    break; 
                case "Taxi":
                    message = $"Taxi service for room {roomNumber}.";
                    break;                                     
                case "Luggage":
                    message = $"Luggage pickup for room {roomNumber}.";
                    break;                                     
                case "Wakeup":
                    message = $"Wake up request for room {roomNumber}.";
                    break; 
                case "SPA":
                    message = $"SPA request for room {roomNumber}.";
                    break;                     
                default:
                        message = "";
                    break;
            }

            return new NotificationMessage(hotelId, message, counters);
        }
    }
}