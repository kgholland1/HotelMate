using System;
using System.ComponentModel.DataAnnotations;

namespace EPOS.API.Models
{
    public class Guest
    {
        public int Id { get; set; }
        
        [MaxLength(150)]
        public string Fullname { get; set; }
        [MaxLength(150)]
        public string Email { get; set; }
        public string Phone { get; set; }
        public byte[] PasswordHash { get; set; }
        public byte[] PasswordSalt { get; set; }
        public DateTime Created { get; set; }
        public DateTime LastActive { get; set; }
    }
}