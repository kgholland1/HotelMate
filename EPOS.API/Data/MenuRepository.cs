using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using EPOS.API.Dtos;
using EPOS.API.Helpers;
using EPOS.API.Models;
using Microsoft.EntityFrameworkCore;

namespace EPOS.API.Data
{
    public class MenuRepository : IMenuRepository
    {
        private readonly DataContext _context;
        public MenuRepository(DataContext context)
        {
            _context = context;
        }

        public void Add<T>(T entity) where T : class
        {
            _context.Add(entity);
        }

        public void Delete<T>(T entity) where T : class
        {
            _context.Remove(entity);
        }
        public async Task<List<CatHeader>> GetCatHeaders()
        {
            var headers = await _context.CatHeaders.ToListAsync();

            return headers;        
        }
        public async Task<PagedList<Category>> GetCategories(CategoryParams categoryParams, int HotelID)
        {
            var categories =  _context.Categories.Where(u => u.HotelId == HotelID).OrderBy(u => u.HeaderName).AsQueryable();

            if (!string.IsNullOrEmpty(categoryParams.OrderBy))
            {
            
                switch (categoryParams.OrderBy)
                {
                    case "HeaderName":
                        categories = categories.OrderBy(u => u.HeaderName).ThenBy(u => u.CatName);
                        break;
                    default:
                        categories = categories.OrderBy(u => u.CatName);
                        break;
                }
            }

            return await PagedList<Category>.CreateAsync(categories, categoryParams.PageNumber, categoryParams.PageSize);          
        }
        public async Task<Category> GetCategory(int id)
        {
            var category = await _context.Categories.FirstOrDefaultAsync(e => e.Id == id);

            return category;        
        }
        public async Task<Extra> GetExtra(int id)
        {
            var extra = await _context.Extras.FirstOrDefaultAsync(e => e.Id == id);

            return extra;        
        }

        public async Task<PagedList<Extra>> GetExtras(ExtraParams extraParams, int hotelID)
        {
            var extras =  _context.Extras.Where(u => u.HotelId == hotelID).OrderBy(u => u.ExtraName).AsQueryable();

            if (!string.IsNullOrEmpty(extraParams.OrderBy))
            {
            
                switch (extraParams.OrderBy)
                {
                    case "ExtraType":
                        extras = extras.OrderBy(u => u.ExtraType).ThenBy(u => u.ExtraName);
                        break;
                    default:
                        extras = extras.OrderBy(u => u.ExtraName);
                        break;
                }
            }

            return await PagedList<Extra>.CreateAsync(extras, extraParams.PageNumber, extraParams.PageSize);
        }

        public async Task<Hotel> GetHotelWithCode(string hotelcode)
        {
            var hotel = await _context.Hotels.FirstOrDefaultAsync(e => e.HotelCode == hotelcode);

            return hotel;        
        }
        public async Task<PagedList<Menu>> GetMenus(CategoryParams categoryParams, int HotelID)
        {
            var menus =  _context.Menus.Include(c => c.Category).Where(u => u.HotelId == HotelID)
                .OrderBy(h => h.CategoryId).AsQueryable();          

             if (categoryParams.CategoryId > 0)
            {
                menus = menus.Where(u => u.CategoryId == categoryParams.CategoryId);
            }

            if (!string.IsNullOrEmpty(categoryParams.OrderBy))
            {
            
                switch (categoryParams.OrderBy)
                {
                    case "Name":
                        menus = menus.OrderBy(u => u.MenuName);
                        break;
                    default:
                        menus = menus.OrderBy(u => u.Category.CatName).ThenBy(u => u.MenuSortNumber);
                        break;
                }
            } 

            return await PagedList<Menu>.CreateAsync(menus, categoryParams.PageNumber, categoryParams.PageSize);          
        }
        public async Task<IEnumerable<KeyValuePairDto>> GetCatKeyValuePair(int hotelId)
        {
            return await _context.Categories
                .Where(h => h.HotelId == hotelId)
                .Select(c =>  new KeyValuePairDto {Id = c.Id, Name= c.CatName})
                .ToListAsync();
       
        }
        public async Task<IEnumerable<KeyValuePairDto>> GetExtraKeyValuePair(int hotelId)
        {
            return await _context.Extras
                .Where(h => h.HotelId == hotelId)
                .Select(c =>  new KeyValuePairDto {Id = c.Id, Name= c.ExtraName + "  ( " + c.UnitPrice + " )" })
                .ToListAsync();
       
        }        
        public async Task<Menu> GetMenu(int id, bool includeRelated = true)
        {
            // var menu = await _context.Menus.FirstOrDefaultAsync(e => e.Id == id);

            if (!includeRelated)
            return await _context.Menus.FindAsync(id);

            return await _context.Menus
            .Include(v => v.MenuExtras)
                .ThenInclude(ve => ve.Extra)
            .SingleOrDefaultAsync(v => v.Id == id);      
        }
        
        public async Task<int> GetMenusByCategory(int categoryid)
        {
           return await _context.Menus.Where(m => m.CategoryId == categoryid).CountAsync(); 
        }
    }
}