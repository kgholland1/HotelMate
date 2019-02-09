using System;

namespace EPOS.API.Dtos
{
    public class MenuOrderListDto
    {
        public int Id { get; set; }
        public string GuestName { get; set; }
        public string RoomNumber { get; set; }                
        public string OrderStatus { get; set; }
        public string OrderDate { get; set; }
        public string OrderTime { get; set; }
        public decimal Total { get; set; }
        public bool Paid { get; set; }
        public DateTime CreatedOn { get; set; }              
    }
}