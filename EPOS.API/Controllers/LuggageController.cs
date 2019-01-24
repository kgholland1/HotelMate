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
    [Route("api/[controller]")]
    public class LuggageController : Controller
    {
        private readonly IKeepingRepository _repo;
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHotelRepository _hotelrepo;  


        public LuggageController(IKeepingRepository repo, IHotelRepository hotelrepo, IMapper mapper, IUnitOfWork unitOfWork)
        {
            _hotelrepo = hotelrepo;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _repo = repo;
        }   
        [HttpGet("{hotelId}")]   
        public async Task<IActionResult> GetLuggages(int hotelId, [FromQuery]LuggageParam luggageParam)
        {

            var luggages = await _repo.GetLuggages(luggageParam, hotelId);

            var luggagesToReturn = _mapper.Map<IEnumerable<LuggageForListDto>>(luggages);

            Response.AddPagination(luggages.CurrentPage, luggages.PageSize, luggages.TotalCount, luggages.TotalPages);

            return Ok(luggagesToReturn);
        }    
        [HttpGet("{hotelId}/{id}/{openType}")]
        public async Task<IActionResult> GetLuggageWithTimes(int hotelId, int id, string openType)
        {
            var luggage = await _repo.GetLuggage(id);
            
            if (luggage == null)
                return NotFound($"Could not find luggage pickup time with an ID of {id}");   

            if (hotelId != luggage.HotelId)
                return BadRequest("Could not find the luggage pickup");

            var luggageToReturn = _mapper.Map<LuggageForUpdateDto>(luggage);

            // retrieve the time
            var openTimes = new List<StringValuePairDto>();            
            var timesFromRepo = await _repo.GetOpenTimes(hotelId, openType, "All Day");
            if (timesFromRepo == null)
                return NotFound($"Could not find opening times for luggage pickup Service.");            
            
            DateTime Start = DateTime.Parse(DateTime.Now.ToShortDateString() + " " + timesFromRepo.Start);
            DateTime End = DateTime.Parse(DateTime.Now.ToShortDateString() + " " + timesFromRepo.End);

            while (Start <= End)
            {

                openTimes.Add(new StringValuePairDto(Start.ToShortTimeString(), Start.ToShortTimeString()));
                Start = Start.AddMinutes(Convert.ToInt32(timesFromRepo.Interval));
            }

            return Ok(new { luggageToReturn, openTimes });
        }   
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateLuggage(int id, [FromBody] LuggageForUpdateDto luggageForUpdateDto)
        {
            if (luggageForUpdateDto == null)
            {
                return BadRequest();
            }
            
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var luggageFromRepo = await _repo.GetLuggage(id);
 
            if (luggageFromRepo == null)
                return NotFound($"Could not find luggage pickup with an ID of {id}");


            _mapper.Map<LuggageForUpdateDto, Luggage>(luggageForUpdateDto, luggageFromRepo);

            if (await  _unitOfWork.CompleteAsync())
                return NoContent(); 

            throw new Exception($"Updating luggage pickup with {id} failed on save");
        } 
         [HttpPost("{luggageId}/setDelete")]
        public async Task<IActionResult> SetLuggageAsDelete(int luggageId)
        {
            var luggageFromRepo = await _repo.GetLuggage(luggageId);

            if (luggageFromRepo == null)
                return NotFound();

            if (luggageFromRepo.IsDeleted)
                return BadRequest("This is already deleted.");

            luggageFromRepo.IsDeleted = true;

            if (await _unitOfWork.CompleteAsync())
                return NoContent();

            return BadRequest("Could not delete luggage pickup");
        }                                         
    }
}