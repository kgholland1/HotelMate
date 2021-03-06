namespace EPOS.API.Helpers
{
    public class ReservationParam
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
        public string RoomNumber { get; set; }  
        public string Fullname { get; set; }  
        public string Email { get; set; }     
        public string Phone { get; set; }    
        public bool All { get; set; } = false;
        public bool IsNew { get; set; } = false;
        public string ReservationDate { get; set; }           
    }
}