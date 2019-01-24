using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using EPOS.API.Dtos;
using EPOS.API.Helpers;
using EPOS.API.Models;
using Microsoft.EntityFrameworkCore;

namespace EPOS.API.Data
{
    public class UserRepository : IUserRepository
    {
        private readonly DataContext _context;
        public UserRepository(DataContext context)
        {
            _context = context;
        }
        public Task<bool> ChangePassword(User user, string currentPassword, string newPassword)
        {
            throw new System.NotImplementedException();
        }

        public void Delete<T>(T entity) where T : class
        {
            _context.Remove(entity);
        }

        public async Task<User> GetUser(int userID)
        {
           var user = await _context.Users.Include(h => h.hotel).FirstOrDefaultAsync(e => e.Id == userID);

            return user;   
        }

        public async Task<PagedList<User>> GetUsers(GeneralParams userParams, int hotelId)
        {
            var userList = await (from user in _context.Users
                        where user.HotelId == hotelId
                        orderby user.UserName
                        select new UserForListDto
                        {
                            Id = user.Id,
                            FullName = user.FullName,
                            Email = user.Email,
                            PhoneNumber = user.PhoneNumber,
                            Department = user.Department,
                            Position = user.Position,
                            LastActive = user.LastActive,
                            Roles = (from userRole in user.UserRoles
                                    join role in _context.Roles
                                    on userRole.RoleId
                                    equals role.Id
                                    select role.Name).ToList()
                        }).ToListAsync();

            var users =  _context.Users.Where(u => u.HotelId == hotelId).OrderBy(u => u.UserName).AsQueryable();

            return await PagedList<User>.CreateAsync(users, userParams.PageNumber, userParams.PageSize);
        }
        public async Task<List<UserForListDto>> GetSystemUsers(int hotelId)
        {
            var userList = await (from user in _context.Users
                        where user.HotelId == hotelId
                        orderby user.UserName
                        select new UserForListDto
                        {
                            Id = user.Id,
                            FullName = user.FullName,
                            Email = user.Email,
                            PhoneNumber = user.PhoneNumber,
                            Department = user.Department,
                            Position = user.Position,
                            LastActive = user.LastActive,
                            Roles = (from userRole in user.UserRoles
                                    join role in _context.Roles
                                    on userRole.RoleId
                                    equals role.Id
                                    select role.Name).ToList()
                        }).ToListAsync();

            return  userList;
        }

        public Task<bool> GuestExists(string email)
        {
            throw new System.NotImplementedException();
        }

        public async Task<bool> Save()
        {
            return await _context.SaveChangesAsync() > 0; 
        }

        public Task<bool> UserExists(string username)
        {
            throw new System.NotImplementedException();
        }
    }
}