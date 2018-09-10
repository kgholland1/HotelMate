using System;

namespace EPOS.API.Dtos
{
    public class NoteforListDto
    {
        public int Id { get; set; }
        public string Notes { get; set; }
        public DateTime? CreatedOn { get; set; }
        public string CreatedBy { get; set; }
        public int BookingId { get; set; } 
    }
}