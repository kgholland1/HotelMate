using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using EPOS.API.Data;
using EPOS.API.Dtos;
using EPOS.API.Helpers;
using EPOS.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EPOS.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    public class WakeController : Controller
    {
 
        private readonly IKeepingRepository _repo;
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHotelRepository _hotelrepo;  

        public WakeController(IKeepingRepository repo, IHotelRepository hotelrepo, IMapper mapper, IUnitOfWork unitOfWork)
        {
            _hotelrepo = hotelrepo;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _repo = repo;
        }  
        [HttpGet("{hotelId}")]   
        public async Task<IActionResult> GetWakes(int hotelId, [FromQuery]WakeParam wakeParam)
        {

            var wakes = await _repo.GetWakeups(wakeParam, hotelId);

            var wakeToReturn = _mapper.Map<IEnumerable<WakeForListDto>>(wakes);

            Response.AddPagination(wakes.CurrentPage, wakes.PageSize, wakes.TotalCount, wakes.TotalPages);

            return Ok(wakeToReturn);
        } 
        [HttpGet("{hotelId}/{id}", Name = "GetWake")]
        public async Task<IActionResult> GetWake(int hotelId, int id)
        {
            var wake = await _repo.GetWake(id);
            
            if (wake == null)
                return NotFound($"Could not find wake up call with an ID of {id}");   

            if (hotelId != wake.HotelId)
                return BadRequest("Could not find the wakeup call");

            var wakeToReturn = _mapper.Map<WakeForUpdateDto>(wake);

            return Ok(wakeToReturn);
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateWake(int id, [FromBody] WakeForUpdateDto wakeForUpdateDto)
        {
            if (wakeForUpdateDto == null)
            {
                return BadRequest();
            }
            
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var wakeFromRepo = await _repo.GetWake(id);
 
            if (wakeFromRepo == null)
                return NotFound($"Could not find wakeup call with an ID of {id}");


            _mapper.Map<WakeForUpdateDto, WakeUp>(wakeForUpdateDto, wakeFromRepo);

            if (await  _unitOfWork.CompleteAsync())
                return NoContent(); 

            throw new Exception($"Updating wakeup call with {id} failed on save");
        } 
        [HttpPost("{wakeId}/setDelete")]
        public async Task<IActionResult> SetWakeAsDelete(int wakeId)
        {
            var wakeFromRepo = await _repo.GetWake(wakeId);

            if (wakeFromRepo == null)
                return NotFound();

            if (wakeFromRepo.IsDeleted)
                return BadRequest("This is already deleted.");

            wakeFromRepo.IsDeleted = true;

            if (await _unitOfWork.CompleteAsync())
                return NoContent();

            return BadRequest("Could not delete wakeup call");
        }                                           
    }
}