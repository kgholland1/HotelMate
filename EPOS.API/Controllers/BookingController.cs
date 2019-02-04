using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using EPOS.API.Data;
using EPOS.API.Dtos;
using EPOS.API.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EPOS.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]  
    public class BookingController  : ControllerBase
    {
        private readonly IBookingRepository _repo;
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;


        public BookingController(IBookingRepository repo,  IMapper mapper, IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _repo = repo;
        }  
        [HttpGet("hotels/{hotelId}")]
        public async Task<IActionResult> GetBookings(int hotelId, [FromQuery]BookingParam bookingParam)
        {
            var bookings = await _repo.GetBookings(bookingParam, hotelId);

            var bookingsToReturn = _mapper.Map<IEnumerable<BookingForListDto>>(bookings);

            Response.AddPagination(bookings.CurrentPage, bookings.PageSize, bookings.TotalCount, bookings.TotalPages);

            return Ok(bookingsToReturn);
        }    

        [HttpGet("{hotelId}/{id}", Name = "GetBooking")]
        public async Task<IActionResult> GetBooking(int hotelId, int id)
        {
            var booking = await _repo.GetBooking(id);
            
            if (booking == null)
                return NotFound($"Could not find guest with an ID of {id}");

            if (hotelId != booking.HotelId)
                return BadRequest("Could not find guest");

            var bookingToReturn = _mapper.Map<BookingForViewDto>(booking);

            return Ok(bookingToReturn);
        }  
        [HttpPost("{bookingId}/setDelete")]
        public async Task<IActionResult> SetGuestAsDelete(int bookingId)
        {
            var bookingFromRepo = await _repo.GetBooking(bookingId);

            if (bookingFromRepo == null)
                return NotFound();

            if (bookingFromRepo.IsDeleted)
                return BadRequest("This is already deleted.");

            bookingFromRepo.IsDeleted = true;

            if (await _unitOfWork.CompleteAsync())
                return NoContent();

            return BadRequest("Could not delete guest");
        }           
    }
}