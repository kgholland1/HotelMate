namespace EPOS.API.Models
{
    public class MenuExtra
    {
        public int MenuId { get; set; }
        public Menu Menu { get; set; }
        public int ExtraId { get; set; }
        public Extra Extra { get; set; }        
    }
}