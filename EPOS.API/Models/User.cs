using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EPOS.API.Models
{
    public class User
    {
        public int Id { get; set; }
        
        [MaxLength(100)]
        public string Username { get; set; }
        [MaxLength(150)]
        public string Email { get; set; }
        public byte[] PasswordHash { get; set; }
        public byte[] PasswordSalt { get; set; }
        public string Role { get; set; }
        public bool Active { get; set; }
        public DateTime Created { get; set; }
        public DateTime LastActive { get; set; }
        
        [ForeignKey("HotelId")]
        public Hotel hotel { get; set; }
        public int HotelId { get; set; }
        public ICollection<UserClaim> Claims { get; set; } = new List<UserClaim>();
    }
}