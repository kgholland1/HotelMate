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
    public class TaxiController : Controller
    {
        private readonly IKeepingRepository _repo;
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHotelRepository _hotelrepo;  


        public TaxiController(IKeepingRepository repo, IHotelRepository hotelrepo, IMapper mapper, IUnitOfWork unitOfWork)
        {
            _hotelrepo = hotelrepo;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _repo = repo;
        } 
        [HttpGet("{hotelId}")]   
        public async Task<IActionResult> GetTaxis(int hotelId, [FromQuery]TaxiParam taxiParam)
        {

            var taxis = await _repo.GetTaxis(taxiParam, hotelId);

            var taxisToReturn = _mapper.Map<IEnumerable<TaxiForListDto>>(taxis);

            Response.AddPagination(taxis.CurrentPage, taxis.PageSize, taxis.TotalCount, taxis.TotalPages);

            return Ok(taxisToReturn);
        }   

        [HttpGet("{hotelId}/{id}/{openType}")]
        public async Task<IActionResult> GetTaxiWithTimes(int hotelId, int id, string openType)
        {
            var taxi = await _repo.GetTaxi(id);
            
            if (taxi == null)
                return NotFound($"Could not find taxi booking with an ID of {id}");   

            if (hotelId != taxi.HotelId)
                return BadRequest("Could not find the taxi booking");

            var taxiToReturn = _mapper.Map<TaxiForUpdateDto>(taxi);

            // retrieve the time
            var openTimes = new List<StringValuePairDto>();            
            var timesFromRepo = await _repo.GetOpenTimes(hotelId, openType, "All Day");
            if (timesFromRepo == null)
                return NotFound($"Could not find opening times for taxi Service.");            
            
            DateTime Start = DateTime.Parse(DateTime.Now.ToShortDateString() + " " + timesFromRepo.Start);
            DateTime End = DateTime.Parse(DateTime.Now.ToShortDateString() + " " + timesFromRepo.End);

            while (Start <= End)
            {

                openTimes.Add(new StringValuePairDto(Start.ToShortTimeString(), Start.ToShortTimeString()));
                Start = Start.AddMinutes(Convert.ToInt32(timesFromRepo.Interval));
            }

            return Ok(new { taxiToReturn, openTimes });
        }   
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTaxi(int id, [FromBody] TaxiForUpdateDto taxiForUpdateDto)
        {
            if (taxiForUpdateDto == null)
            {
                return BadRequest();
            }
            
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var taxiFromRepo = await _repo.GetTaxi(id);
 
            if (taxiFromRepo == null)
                return NotFound($"Could not find taxi booking with an ID of {id}");


            _mapper.Map<TaxiForUpdateDto, Taxi>(taxiForUpdateDto, taxiFromRepo);

            if (await  _unitOfWork.CompleteAsync())
                return NoContent(); 

            throw new Exception($"Updating taxi booking with {id} failed on save");
        }  
         [HttpPost("{taxiId}/setDelete")]
        public async Task<IActionResult> SetTaxiAsDelete(int taxiId)
        {
            var taxiFromRepo = await _repo.GetTaxi(taxiId);

            if (taxiFromRepo == null)
                return NotFound();

            if (taxiFromRepo.IsDeleted)
                return BadRequest("This is already deleted.");

            taxiFromRepo.IsDeleted = true;

            if (await _unitOfWork.CompleteAsync())
                return NoContent();

            return BadRequest("Could not delete taxi booking");
        }                         
                                
    }
}