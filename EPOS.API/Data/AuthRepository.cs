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
       public async Task<User> Login(string email, string password)
        {
            var user = await _context.Users.Include(c => c.UserRoles).FirstOrDefaultAsync(x => x.Email == email);

            if (user == null)
                return null;
/* 
            if (!VerifyPasswordHash(password, user.PasswordHash, user.PasswordSalt))
                return null; */
            
            // auth successful
            return user;
        }
       public async Task<Guest> GuestLogin(string email, string password)
        {
            var guest = await _context.Guests.FirstOrDefaultAsync(x => x.Email == email);

            if (guest == null)
                return null;

            if (!VerifyPasswordHash(password, guest.PasswordHash, guest.PasswordSalt))
                return null;
            
            // auth successful
            return guest;
        }
        private bool VerifyPasswordHash(string password, byte[] passwordHash, byte[] passwordSalt)
        {
           using (var hmac = new System.Security.Cryptography.HMACSHA512(passwordSalt))
           {
               var computedHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
               for (int i = 0; i < computedHash.Length; i++)
               {
                   if (computedHash[i] != passwordHash[i]) return false;
               }
           }
           return true;
        }
       public async Task<bool> ChangePassword(User user, string currentPassword, string newPassword)
        {

/*             if (!VerifyPasswordHash(currentPassword, user.PasswordHash, user.PasswordSalt))
                return false;

            byte[] passwordHash, passwordSalt;
            CreatePasswordHash(newPassword, out passwordHash, out passwordSalt);
            
            user.PasswordHash = passwordHash;
            user.PasswordSalt = passwordSalt;*/
            await _context.SaveChangesAsync(); 
            // auth successful
            return true;
        }
        public async Task<User> Register(User user, string password)
        {
            byte[] passwordHash, passwordSalt;
            CreatePasswordHash(password, out passwordHash, out passwordSalt);
/* 
            user.PasswordHash = passwordHash;
            user.PasswordSalt = passwordSalt; */


            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();

            return user;
        }

        public async Task<Guest> RegisterGuest(Guest guest, string password)
        {
            byte[] passwordHash, passwordSalt;
            CreatePasswordHash(password, out passwordHash, out passwordSalt);

            guest.PasswordHash = passwordHash;
            guest.PasswordSalt = passwordSalt;


            await _context.Guests.AddAsync(guest);
            await _context.SaveChangesAsync();

            return guest;
        }
        public async Task<User> AddClaims(User user)
        {
            // retrieve claim based on user's role
/*             var userClaims =  await _context.RoleClaims.Where(s => s.RoleType == user.Role).ToListAsync();

            if (userClaims != null) {
                
                foreach (RoleClaim claim in userClaims)
                {
                    var item = new UserClaim();
                    item.ClaimType = claim.ClaimType;
                    item.ClaimValue = "true";

                    user.Claims.Add(item);
                }

                 await _context.SaveChangesAsync();
            } */
            await _context.SaveChangesAsync();

            return user;
        }
        public async Task<User> AddClaimsForNewRole(int Id, string role)
        {
             var user = await _context.Users.Include(u => u.UserRoles).FirstOrDefaultAsync(e => e.Id == Id);
            // retrieve claim based on user's role
/*             var userClaims =  await _context.RoleClaims.Where(s => s.RoleType == role).ToListAsync();

            if (userClaims != null) {
                
                foreach (RoleClaim claim in userClaims)
                {
                    var item = new UserClaim();
                    item.ClaimType = claim.ClaimType;
                    item.ClaimValue = "true";

                    user.Claims.Add(item);
                }

                 await _context.SaveChangesAsync();
            } */

            return user;
        } 
        public async Task<User> RemoveClaims(int Id)
        {
            var user = await _context.Users.Include(u => u.UserRoles).FirstOrDefaultAsync(e => e.Id == Id);
/* 
            user.Claims.Clear(); */

            await _context.SaveChangesAsync();

            return user;
        }       
        private void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
           using (var hmac = new System.Security.Cryptography.HMACSHA512())
           {
               passwordSalt = hmac.Key;
               passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
           }
        }

        public async Task<bool> UserExists(string email)
        {
            if (await _context.Users.AnyAsync(x => x.Email == email))
                return true;
            
            return false;
        }
        public async Task<bool> GuestExists(string email)
        {
            if (await _context.Guests.AnyAsync(x => x.Email == email))
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