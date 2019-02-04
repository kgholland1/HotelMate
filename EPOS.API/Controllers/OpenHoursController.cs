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
    [Route("api/hotels/{hotelId}/openHours")]
    [ApiController] 
    public class OpenHoursController : ControllerBase
    {
        private readonly ISystemRepository _repo;
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;

        public OpenHoursController(ISystemRepository repo,  IMapper mapper, IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _repo = repo;
        } 
        [HttpGet]
        public async Task<IActionResult> GetOpenHours(int hotelId, [FromQuery]GeneralParams openHourParams)
        {

            var openhours = await _repo.GetOpenHours(openHourParams, hotelId);

            var openHoursToReturn = _mapper.Map<IEnumerable<OpenHoursForListDto>>(openhours);

            Response.AddPagination(openhours.CurrentPage, openhours.PageSize, openhours.TotalCount, openhours.TotalPages);

            return Ok(openHoursToReturn);
        } 
        [HttpGet("{id}", Name = "GetOpenHour")]
        public async Task<IActionResult> GetOpenHour(int id)
        {
            var openHour = await _repo.GetOpenHour(id);

            if (openHour == null)
                return NotFound($"Could not find Opentimes with an ID of {id}");

            var openHourToReturn = _mapper.Map<OpenHourForUpdateDto>(openHour);

            return Ok(openHourToReturn);
        } 
        [HttpPost]
        public async Task<IActionResult> CreateOpenHours(int hotelId, OpenHourForUpdateDto openHourForUpdateDto)
        {
            if (openHourForUpdateDto == null)
            {
                return BadRequest();
            }
                
            var openHourEntity = _mapper.Map<OpenTime>(openHourForUpdateDto);

            openHourEntity.HotelId = hotelId;

            _repo.Add(openHourEntity);

            if (await _unitOfWork.CompleteAsync()){
                var openHourToReturn = _mapper.Map<OpenHourForUpdateDto>(openHourEntity);
                return CreatedAtRoute("GetOpenHour", new { id = openHourToReturn.Id }, openHourToReturn);
            }

            throw new Exception("Creating the open hours failed on save");
        }    
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, OpenHourForUpdateDto openHourForUpdateDto)
        {
            if (openHourForUpdateDto == null)
            {
                return BadRequest();
            }

            var openHourFromRepo = await _repo.GetOpenHour(id);

            if (openHourFromRepo == null)
                return NotFound($"Could not find open hours with an ID of {id}");

            _mapper.Map<OpenHourForUpdateDto, OpenTime>(openHourForUpdateDto, openHourFromRepo);

            if (await  _unitOfWork.CompleteAsync())
                return NoContent();

            throw new Exception($"Updating open hours {id} failed on save");
        } 
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOpenHours(int id)
        {

            var openHourFromRepo = await _repo.GetOpenHour(id);
            
            if (openHourFromRepo == null)
                return NotFound();

            _repo.Delete(openHourFromRepo);

            if (await  _unitOfWork.CompleteAsync())
                return NoContent();

            return BadRequest("Failed to delete the open hours");
        }                                                   
    }
}