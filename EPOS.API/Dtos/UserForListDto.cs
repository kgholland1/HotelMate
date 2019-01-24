using System;
using System.Collections.Generic;

namespace EPOS.API.Dtos
{
    public class UserForListDto
    {
        public int Id { get; set; }        
        public string Email { get; set; }
        public string FullName { get; set; }
        public string PhoneNumber { get; set; }
        public string Department { get; set; }
        public string Position { get; set; }            
        public DateTime LastActive { get; set; }              
       public List<string> Roles { get; set; } =new List<string>();               
     
    }
}