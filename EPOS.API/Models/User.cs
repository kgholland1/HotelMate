using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;

namespace EPOS.API.Models
{
    public class User : IdentityUser<int>
    {
        public DateTime Created { get; set; }
        public DateTime LastActive { get; set; }

        [Required]
        [MaxLength(200)]       
        public string FullName { get; set; }
        public string Department { get; set; }
        public string Position { get; set; }   

        [ForeignKey("HotelId")]
        public Hotel hotel { get; set; }
        public int HotelId { get; set; }
        public ICollection<UserRole> UserRoles { get; set; }
    }
}