namespace EPOS.API.Dtos
{
    public class UserForUpdateDto
    {
        public string CurrentRole { get; set; }
        public string NewRole { get; set; }
        public bool Active { get; set; }        
    }
}