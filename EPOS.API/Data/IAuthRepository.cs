using System.Collections.Generic;
using System.Threading.Tasks;
using EPOS.API.Helpers;
using EPOS.API.Models;

namespace EPOS.API.Data
{
    public interface IAuthRepository
    {
        void Delete<T>(T entity) where T: class;
        Task<User> Register(User user, string password);
        Task<Guest> RegisterGuest(Guest guest, string password);
        Task<bool> ChangePassword(User user, string currentPassword, string newPassword);
        Task<User> AddClaims(User user);
        Task<User> Login(string username, string password);
        Task<Guest> GuestLogin(string email, string password);
        Task<bool> UserExists(string username);   
        Task<bool> GuestExists(string email);
        Task<Hotel> HotelSignup(Hotel hotel);
        Task<User> GetUser(int userID);
        Task<PagedList<User>> GetUsers(GeneralParams userParams, int hotelId);
        Task<User> RemoveClaims(int Id);
        Task<User> AddClaimsForNewRole(int Id, string role);
        Task<bool> Save();
    }
}