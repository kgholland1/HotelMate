using System.ComponentModel.DataAnnotations;

namespace EPOS.API.Dtos
{
    public class HotelForCreateDto
    {
        [Required]
        public string HotelName { get; set; }
        public string Address1 { get; set; }
        public string Address2 { get; set; }
        public string Town { get; set; }
        public string County { get; set; }
        public string Country { get; set; }
        public string PostCode { get; set; }
        public string Phone { get; set; }    
        public string Email { get; set; }            
        public string Website { get; set; } 
        [Required]    
        public string username { get; set; }            
        
        [Required(ErrorMessage = "Please enter an email Address")]
        [RegularExpression(@"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}", ErrorMessage = "Please enter a valid email address")]
        public string useremail { get; set; }
        [Required]
        [StringLength(20, MinimumLength = 4, ErrorMessage = "You must specify a password between 4 and 20 characters")]           
        public string userpassword { get; set; }           
    }
}