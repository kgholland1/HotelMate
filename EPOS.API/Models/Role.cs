using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;

namespace EPOS.API.Models
{
    public class Role : IdentityRole<int>
    {
        public ICollection<UserRole> UserRoles { get; set; }
    }

}