using System.Collections.Generic;
using System.Threading.Tasks;
using EPOS.API.Dtos;
using EPOS.API.Helpers;
using EPOS.API.Models;

namespace EPOS.API.Data
{
    public interface IUserRepository
    {
        void Delete<T>(T entity) where T: class;
        Task<bool> ChangePassword(User user, string currentPassword, string newPassword);
        Task<bool> UserExists(string username);   
        Task<bool> GuestExists(string email);
        Task<User> GetUser(int userID);
        Task<PagedList<User>> GetUsers(GeneralParams userParams, int hotelId);
        Task<List<UserForListDto>> GetSystemUsers(int hotelId);
        Task<bool> Save();         
    }
}