using System.ComponentModel.DataAnnotations;

namespace EPOS.API.Dtos
{
    public class UserForRegisterDto
    {
        
        [Required(ErrorMessage = "Please enter an email Address")]
         [RegularExpression(@"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}", ErrorMessage = "Please enter a valid email address")]
        [DataType(DataType.EmailAddress)]
        public string Email { get; set; }
        [Required]
        [StringLength(20, MinimumLength = 4, ErrorMessage = "You must specify a password between 4 and 20 characters")]
        public string Password { get; set; }
        [Phone]
        public string PhoneNumber { get; set; }

        [Required(ErrorMessage = "Please enter your name")]
        public string FullName { get; set; }
        public string Department { get; set; }
        public string Position { get; set; } 
        [Required]
         public string HotelCode { get; set; }
    }
}