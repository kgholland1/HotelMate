using System.Collections.Generic;
using System.Threading.Tasks;
using EPOS.API.Helpers;
using EPOS.API.Models;

namespace EPOS.API.Data
{
    public interface IAuthRepository
    {
        void Delete<T>(T entity) where T: class;
        Task<bool> UserExists(string username);   
        Task<User> GetUser(int userID);
        Task<PagedList<User>> GetUsers(GeneralParams userParams, int hotelId);
        Task<bool> Save();
    }
}