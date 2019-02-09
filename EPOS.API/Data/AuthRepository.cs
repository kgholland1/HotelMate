using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using EPOS.API.Helpers;
using EPOS.API.Models;
using Microsoft.EntityFrameworkCore;

namespace EPOS.API.Data
{
    public class AuthRepository : IAuthRepository
    {
        private readonly DataContext _context;
        public AuthRepository(DataContext context)
        {
            _context = context;
        }
        public void Delete<T>(T entity) where T : class
        {
            _context.Remove(entity);
        } 

        public async Task<bool> UserExists(string email)
        {
            if (await _context.Users.AnyAsync(x => x.Email == email))
                return true;
            
            return false;
        }

        public async Task<User> GetUser(int userID)
        {
           var user = await _context.Users.Include(h => h.hotel).FirstOrDefaultAsync(e => e.Id == userID);

            return user;        

        }
        public async Task<PagedList<User>> GetUsers(GeneralParams userParams, int hotelId)
        {      
            var users =  _context.Users.Where(u => u.HotelId == hotelId).OrderBy(u => u.UserName).AsQueryable();

            return await PagedList<User>.CreateAsync(users, userParams.PageNumber, userParams.PageSize);
        }        

        public async Task<bool> Save()
        {
            return await _context.SaveChangesAsync() > 0;      
        }

    }
}