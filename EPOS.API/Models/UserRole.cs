using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;

namespace EPOS.API.Models
{
    public class UserRole: IdentityUserRole<int>
    {
        public User User { get; set; }

        public Role Role { get; set; }
    }
}