namespace EPOS.API.Helpers
{
    public class OrderParam
    {
        private const int MaxPageSize = 50;
        public int PageNumber { get; set; } = 1;
        private int pageSize = 10;
        public int PageSize
        {
            get { return pageSize;}
            set { pageSize = (value > MaxPageSize) ? MaxPageSize : value;}
        }   
        public string OrderBy { get; set; }    
        public string OrderNo { get; set; }    
        public string RoomNumber { get; set; }  
        public string Fullname { get; set; }  
        public string Email { get; set; }     
        public string Phone { get; set; }    
        public string OrderStatus { get; set; }
        public string StartDate { get; set; }    
        public string EndDate { get; set; }          
    }
}