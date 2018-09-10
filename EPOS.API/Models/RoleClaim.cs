using System.ComponentModel.DataAnnotations;

namespace EPOS.API.Models
{
    public class RoleClaim
    {
        public int Id { get; set; }
        
        [StringLength(60)]
        public string RoleType { get; set; }
        [MaxLength(150)]
        public string ClaimType { get; set; }        
    }
}