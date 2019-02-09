using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using EPOS.API.Data;
using EPOS.API.Dtos;
using EPOS.API.Helpers;
using EPOS.API.Hubs;
using EPOS.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace EPOS.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReservationController : ControllerBase
    {
        private readonly IBookingRepository _repo;
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHubContext<NotificationsHub> _notifyHub;
        private readonly IHotelRepository _hotelrepo;
        public ReservationController(IBookingRepository repo, IMapper mapper, IHotelRepository hotelrepo,
            IUnitOfWork unitOfWork, IHubContext<NotificationsHub> notifyHub)
        {
            _hotelrepo = hotelrepo;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _repo = repo;
            _notifyHub = notifyHub;
        }
        [HttpGet("hotels/{hotelId}")]
        public async Task<IActionResult> GetReservations(int hotelId, [FromQuery]ReservationParam reservationParam)
        {

            var reservations = await _repo.GetReservations(reservationParam, hotelId);

            var reservationsToReturn = _mapper.Map<IEnumerable<ReservationForListDto>>(reservations);

            Response.AddPagination(reservations.CurrentPage, reservations.PageSize, reservations.TotalCount, reservations.TotalPages);

            return Ok(reservationsToReturn);
        }

        [HttpGet("hotels/{hotelId}/{id}/{openType}")]
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
        public async Task<IActionResult> UpdateReservation(int id, ReservationForDetailDto reservationForSaveDto)
        {
            if (reservationForSaveDto == null)
            {
                return BadRequest();
            }

            var reservationFromRepo = await _repo.GetReservation(id);

            if (reservationFromRepo == null)
                return NotFound($"Could not find reservation with an ID of {id}");

            _mapper.Map<ReservationForDetailDto, Reservation>(reservationForSaveDto, reservationFromRepo);

            if (await _unitOfWork.CompleteAsync())
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
        
        [HttpPost()]
        public async Task<IActionResult> CreateReservation(ReservationForCreateDto reservationForCreateDto)
        {
            if (reservationForCreateDto == null)
            {
                return BadRequest();
            }

            // retrieve current user's detail
            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
//            var userFromRepo = await _hotelrepo.GetUser(currentUserId); 

            // booking details
            var bookingFromRepo  = await _repo.GuestCurrentBooking(currentUserId);
            
            if (bookingFromRepo == null)
                return NotFound($"Could not find guest booking");

            var reservationEntity = _mapper.Map<Reservation>(reservationForCreateDto);

            reservationEntity.GuestName = bookingFromRepo.GuestName;
            reservationEntity.Email = bookingFromRepo.Email;
            reservationEntity.Phone = bookingFromRepo.Phone;
            reservationEntity.RoomNumber = bookingFromRepo.RoomNumber;
            reservationEntity.IsNew = true;
            reservationEntity.IsDeleted = false;
            reservationEntity.IsCompleted = false;
            reservationEntity.BookingId = bookingFromRepo.Id;
            reservationEntity.HotelId = bookingFromRepo.HotelId;          
            _repo.Add(reservationEntity);

            /// signalR section to copy out
            var notificationFromRepo = await _hotelrepo.GetNotificationCounters(bookingFromRepo.HotelId);

            if (notificationFromRepo != null)
            {
                notificationFromRepo.ReservationCount +=1; 

                var notificationToReturn = _mapper.Map<NotificationDto>(notificationFromRepo);               

                var notificationMessage = NotificationMessage.CreateNotification(bookingFromRepo.HotelId, "Reservation",
                    reservationEntity.RoomNumber, notificationToReturn);

                await _notifyHub.Clients.All.SendAsync("NewRequest", notificationMessage);
            }

            if (await _unitOfWork.CompleteAsync()){
                var reservationToReturn = _mapper.Map<ReservationForDetailDto>(reservationEntity);

                return CreatedAtRoute("GetReservation", new { id = reservationEntity.Id }, reservationToReturn);
            }

            throw new Exception("Creating the reservation failed on save");
        } 

        [HttpGet("{id}", Name = "GetReservation")]
        public async Task<IActionResult> GetReservation(int Id)
        {
            var reservation = await _repo.GetReservation(Id);

            if (reservation == null)
                return NotFound($"Could not find reservation with an ID of {Id}");

            var reservationToReturn = _mapper.Map<ReservationForDetailDto>(reservation);

            return Ok(reservationToReturn);
        }       
    }
}