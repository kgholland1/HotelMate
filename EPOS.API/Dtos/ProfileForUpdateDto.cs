using System;
using System.ComponentModel.DataAnnotations;

namespace EPOS.API.Dtos
{
    public class ProfileForUpdateDto
    {
        [Required]
        public string Username { get; set; }
        
        [Required(ErrorMessage = "Please enter an email Address")]
        [RegularExpression(@"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}", ErrorMessage = "Please enter a valid email address")]
        [DataType(DataType.EmailAddress)]
        public string Email { get; set; }
        public string OldEmail { get; set; }
    }
}