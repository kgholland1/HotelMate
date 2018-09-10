using System.Threading.Tasks;
using EPOS.API.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using AutoMapper;
using EPOS.API.Helpers;
using System.Collections.Generic;
using EPOS.API.Dtos;
using System.Security.Claims;
using EPOS.API.Models;
using System;

namespace EPOS.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    public class ExtrasController : Controller
    {
        private readonly IMenuRepository _repo;
        private readonly IHotelRepository _hotelrepo;
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;

        public ExtrasController(IMenuRepository repo, IHotelRepository hotelrepo, IMapper mapper, IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _repo = repo;
            _hotelrepo = hotelrepo;
        }

        [HttpGet]
        public async Task<IActionResult> GetExtras([FromQuery]ExtraParams extraParams)
        {

            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);

            var userFromRepo = await _hotelrepo.GetUser(currentUserId);

            var extras = await _repo.GetExtras(extraParams, userFromRepo.HotelId);

            var extrasToReturn = _mapper.Map<IEnumerable<ExtraForListDto>>(extras);

            Response.AddPagination(extras.CurrentPage, extras.PageSize, extras.TotalCount, extras.TotalPages);

            return Ok(extrasToReturn);
        }

        [HttpGet("{id}", Name = "GetExtra")]
        public async Task<IActionResult> GetExtra(int id)
        {
            var extra = await _repo.GetExtra(id);

            var extraToReturn = _mapper.Map<ExtraForUpdateDto>(extra);

            return Ok(extraToReturn);
        }
        [HttpPost]
        public async Task<IActionResult> CreateExtra([FromBody] ExtraForUpdateDto extraForUpdateDto)
        {
            if (extraForUpdateDto == null)
            {
                return BadRequest();
            }
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // retieve the hotel id from the login user
            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);

            var userFromRepo = await _hotelrepo.GetUser(currentUserId);
                
            var extraEntity = _mapper.Map<Extra>(extraForUpdateDto);

            extraEntity.HotelId = userFromRepo.HotelId;

            _repo.Add(extraEntity);

            if (await _unitOfWork.CompleteAsync()){
                var extraToReturn = _mapper.Map<ExtraForUpdateDto>(extraEntity);
                return CreatedAtRoute("GetExtra", new { id = extraEntity.Id }, extraToReturn);
            }

            throw new Exception("Creating the option or extra failed on save");
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateExtra(int id, [FromBody] ExtraForUpdateDto extraForUpdateDto)
        {
            if (extraForUpdateDto == null)
            {
                return BadRequest();
            }
            
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var extraFromRepo = await _repo.GetExtra(id);

            if (extraFromRepo == null)
                return NotFound($"Could not find option with an ID of {id}");

            _mapper.Map(extraForUpdateDto, extraFromRepo);

            if (await  _unitOfWork.CompleteAsync())
                return NoContent();

            throw new Exception($"Updating option {id} failed on save");
        }
        
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteExtra(int id)
        {

            var extraFromRepo = await _repo.GetExtra(id);
            
            if (extraFromRepo == null)
                return NotFound();

            _repo.Delete(extraFromRepo);

            if (await  _unitOfWork.CompleteAsync())
                return NoContent();

            return BadRequest("Failed to delete the extra");
        }
        [HttpGet("{hotelId}/KeyValue")]  
        public async Task<IEnumerable<KeyValuePairDto>> GetExtraForDropdown(int hotelId)
        {
        var extras = await _repo.GetExtraKeyValuePair(hotelId);

        return extras;
        }     
    }
}