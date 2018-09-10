namespace EPOS.API.Dtos
{
    public class RoomForListDto
    {
        public int Id { get; set; }
        public string RoomNo { get; set; }
        public string FloorNo { get; set; }        
        public string Building { get; set; }
        public string RoomDesc { get; set; }   
    }
}