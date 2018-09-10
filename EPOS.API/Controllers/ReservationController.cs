using System;
using System.Collections.Generic;
using System.Security.Claims;
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
    public class ReservationController : Controller
    {
        private readonly IBookingRepository _repo;
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHotelRepository _hotelrepo;     
        public ReservationController(IBookingRepository repo, IHotelRepository hotelrepo, IMapper mapper, IUnitOfWork unitOfWork)
        {
            _hotelrepo = hotelrepo;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _repo = repo;
        }  
        [HttpGet("{hotelId}")]
        public async Task<IActionResult> GetReservations(int hotelId, [FromQuery]ReservationParam reservationParam)
        {

            var reservations = await _repo.GetReservations(reservationParam, hotelId);

            var reservationsToReturn = _mapper.Map<IEnumerable<ReservationForListDto>>(reservations);

            Response.AddPagination(reservations.CurrentPage, reservations.PageSize, reservations.TotalCount, reservations.TotalPages);

            return Ok(reservationsToReturn);
        }   

        [HttpGet("{hotelId}/{id}/{openType}")]
        public async Task<IActionResult> GetReservationWithTimes(int hotelId, int id, string openType)
        {
            var reservation = await _repo.GetReservation(id);
            
            if (reservation == null)
                return NotFound($"Could not find reservation with an ID of {id}");   

            if (hotelId != reservation.HotelId)
                return BadRequest("Could not find reservation");

            var reservationToReturn = _mapper.Map<ReservationForDetailDto>(reservation);

            // retrieve the time
            var openTimes = new List<StringValuePairDto>();            
            var timesFromRepo = await _repo.GetOpenTimes(hotelId, openType, reservation.TypeName);
            if (timesFromRepo == null)
                return NotFound($"Could not find opening times for reservation with an ID of {reservation.Id}");            
            
            DateTime Start = DateTime.Parse(DateTime.Now.ToShortDateString() + " " + timesFromRepo.Start);
            DateTime End = DateTime.Parse(DateTime.Now.ToShortDateString() + " " + timesFromRepo.End);

            while (Start <= End)
            {

                openTimes.Add(new StringValuePairDto(Start.ToShortTimeString(), Start.ToShortTimeString()));
                Start = Start.AddMinutes(Convert.ToInt32(timesFromRepo.Interval));
            }

            return Ok(new { reservationToReturn, openTimes });
        }   

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateReservation(int id, [FromBody] ReservationForDetailDto reservationForSaveDto)
        {
            if (reservationForSaveDto == null)
            {
                return BadRequest();
            }
            
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var reservationFromRepo = await _repo.GetReservation(id);
 
            if (reservationFromRepo == null)
                return NotFound($"Could not find reservation with an ID of {id}");

            reservationFromRepo.IsNew = false;

            _mapper.Map<ReservationForDetailDto, Reservation>(reservationForSaveDto, reservationFromRepo);

            if (await  _unitOfWork.CompleteAsync())
                return NoContent(); 

            throw new Exception($"Updating reservation {id} failed on save");
        }  
        [HttpPost("{reservationId}/setDelete")]
        public async Task<IActionResult> SetReservationAsDelete(int reservationId)
        {
            var reservationFromRepo = await _repo.GetReservation(reservationId);

            if (reservationFromRepo == null)
                return NotFound();

            if (reservationFromRepo.IsDeleted)
                return BadRequest("This is already deleted.");

            reservationFromRepo.IsDeleted = true;

            if (await _unitOfWork.CompleteAsync())
                return NoContent();

            return BadRequest("Could not delete reservation");
        }                         
    }
}