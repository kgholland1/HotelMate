using System;
using System.Collections.Generic;
using System.Linq;
using EPOS.API.Models;
using Microsoft.AspNetCore.Identity;
using Newtonsoft.Json;

namespace EPOS.API.Data
{
   public class Seed
    {
        private readonly UserManager<User> _userManager;
        private readonly RoleManager<Role> _roleManager;

        public Seed(UserManager<User> userManager, RoleManager<Role> roleManager)
        {
            _userManager = userManager;
            _roleManager = roleManager;
        }

        public void SeedUsers()
        {
            if (!_userManager.Users.Any())
            {

                var roles = new List<Role>
                {
                    new Role{Name = "Admin"},
                    new Role{Name = "Manager"},                    
                    new Role{Name = "Supervisor"},
                    new Role{Name = "Staff"}
                };

                foreach (var role in roles)
                {
                    _roleManager.CreateAsync(role).Wait();
                }

                var adminUser = new User
                {
                    UserName = "superadmin@gmail.com",
                    Email = "superadmin@gmail.com",
                    FullName = "Kenneth Holland",
                    PhoneNumber = "07957654152",
                    Department = "IT Department",
                    Position = "Software Developer",
                    HotelId = 1,
                    Created = DateTime.UtcNow,
                    LastActive = DateTime.UtcNow,                    
                };

                IdentityResult result = _userManager.CreateAsync(adminUser, "password").Result;

                if (result.Succeeded)
                {
                    var admin = _userManager.FindByEmailAsync("superadmin@gmail.com").Result;
                    _userManager.AddToRolesAsync(admin, new[] {"Admin", "Manager"}).Wait();
                }
            }
        }
    }

}