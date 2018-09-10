namespace EPOS.API.Dtos
{
    public class OpenHoursForListDto
    {
        public int Id { get; set; }        
        public string Type { get; set; }
        public string TypeName { get; set; }  
        public string Start { get; set; } 
        public string End { get; set; }   
        public string Interval { get; set; }    
    }
}