using System;
using System.ComponentModel.DataAnnotations;

namespace EPOS.API.Dtos
{
    public class ProfileForUpdateDto
    {
        [Required(ErrorMessage = "Please enter your name")]
        public string FullName { get; set; }
        public string PhoneNumber { get; set; }
        public string Department { get; set; }
        public string Position { get; set; }
    }
}