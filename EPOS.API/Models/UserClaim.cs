using System.ComponentModel.DataAnnotations;

namespace EPOS.API.Models
{
    public class UserClaim
    {

    public int Id { get; set; }

    public int UserId { get; set; }

    [StringLength(150)]  
    public string ClaimType { get; set; }
    
    [StringLength(15)]
    public string ClaimValue { get; set; }
    }
}