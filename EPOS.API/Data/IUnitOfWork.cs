using System.Threading.Tasks;

namespace EPOS.API.Data
{
    public interface IUnitOfWork
    {
         Task<bool> CompleteAsync();
    }
}