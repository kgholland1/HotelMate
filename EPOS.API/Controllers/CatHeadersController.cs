using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using EPOS.API.Data;
using EPOS.API.Dtos;
using EPOS.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EPOS.API.Controllers
{
    [Route("api/[controller]")]
    public class CatHeadersController : Controller
    {
        
        private readonly IMenuRepository _repo;
        private readonly IMapper _mapper;

        public CatHeadersController(IMenuRepository repo, IMapper mapper)
        {
            _mapper = mapper;
            _repo = repo;
        }

        [HttpGet]
        public async Task<IEnumerable<KeyValuePairDto>> GetHeaders()
        {
        var catHeaders = await _repo.GetCatHeaders();

        return _mapper.Map<List<CatHeader>, List<KeyValuePairDto>>(catHeaders);
        }
        
    }
}