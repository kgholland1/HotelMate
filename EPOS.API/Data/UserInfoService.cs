using System;
using System.Linq;
using System.Collections.Generic;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;

namespace EPOS.API.Data
{
    public class UserInfoService: IUserInfoService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public string UserId { get; set; }
        public string Username { get; set; } 
        
        public UserInfoService(IHttpContextAccessor httpContextAccessor)
        {
            // service is scoped, created once for each request => we only need
            // to fetch the info in the constructor
            _httpContextAccessor = httpContextAccessor 
                ?? throw new ArgumentNullException(nameof(httpContextAccessor));

            var currentContext = _httpContextAccessor.HttpContext;
            if (currentContext == null || !currentContext.User.Identity.IsAuthenticated)
            {
                UserId = "n/a";
                Username = "n/a";
                return;
            }
            
            UserId = (currentContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value) ?? "n/a";
            Username = (currentContext.User.FindFirst(ClaimTypes.Name)?.Value) ?? "n/a";

        }
    }
}
