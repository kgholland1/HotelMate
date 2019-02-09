namespace EPOS.API.Dtos
{
    public class MenuOrderDetailsDto
    {
        public int Id { get; set; }        
        public int MenuOrderId { get; set; }  
        public int MenuID { get; set; } 
        public string MenuName { get; set; }
        public decimal Price { get; set; }
        public string DishRequest { get; set; }  
        public int MenuCount { get; set; }
        public string Options { get; set; }
        public string Extras { get; set; }        
        public string OptionKeys { get; set; }
        public string ExtraKeys { get; set; }        
    }
}