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
using System.Security.Claims;
using EPOS.API.Hubs;
using Microsoft.AspNetCore.SignalR;

namespace EPOS.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TaxiController : ControllerBase
    {
        private readonly IKeepingRepository _repo;
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHotelRepository _hotelrepo;  
        private readonly IBookingRepository _bookingrepo;
        private readonly IHubContext<NotificationsHub> _notifyHub;

        public TaxiController(IKeepingRepository repo, IHotelRepository hotelrepo, IBookingRepository bookingrepo,
            IMapper mapper, IUnitOfWork unitOfWork, IHubContext<NotificationsHub> notifyHub)
        {
            _hotelrepo = hotelrepo;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _repo = repo;
            _bookingrepo = bookingrepo;
            _notifyHub = notifyHub;
        } 
        [HttpGet("hotels/{hotelId}")]   
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
        [HttpGet("{id}", Name = "GetTaxi")]
        public async Task<IActionResult> GetTaxi(int Id)
        {
            var taxiFromRepo = await _repo.GetTaxi(Id);

            if (taxiFromRepo == null)
                return NotFound($"Could not find taxi with an ID of {Id}");

            var taxiToReturn = _mapper.Map<TaxiForUpdateDto>(taxiFromRepo);

            return Ok(taxiToReturn);
        }

        [HttpPost()]
        public async Task<IActionResult> CreateTaxi(TaxiForCreateDto taxiForCreateDto)
        {
            if (taxiForCreateDto == null)
            {
                return BadRequest();
            }

            // retrieve current user's detail
            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
//            var userFromRepo = await _hotelrepo.GetUser(currentUserId); 

            // booking details
            var bookingFromRepo  = await _bookingrepo.GuestCurrentBooking(currentUserId);
            
            if (bookingFromRepo == null)
                return NotFound($"Could not find guest booking");

            var taxiEntity = _mapper.Map<Taxi>(taxiForCreateDto);

            taxiEntity.GuestName = bookingFromRepo.GuestName;
            taxiEntity.Email = bookingFromRepo.Email;
            taxiEntity.Phone = bookingFromRepo.Phone;
            taxiEntity.RoomNumber = bookingFromRepo.RoomNumber;
            taxiEntity.BookStatus = "Pending";
            taxiEntity.IsDeleted = false;
            taxiEntity.BookingId = bookingFromRepo.Id;
            taxiEntity.HotelId = bookingFromRepo.HotelId;          
            _repo.Add(taxiEntity);

            /// signalR section to copy out
            var notificationFromRepo = await _hotelrepo.GetNotificationCounters(bookingFromRepo.HotelId);

            if (notificationFromRepo != null)
            {
                notificationFromRepo.TaxiCount +=1; 

                var notificationToReturn = _mapper.Map<NotificationDto>(notificationFromRepo);               

                var notificationMessage = NotificationMessage.CreateNotification(bookingFromRepo.HotelId, "Taxi",
                    taxiEntity.RoomNumber, notificationToReturn);

                await _notifyHub.Clients.All.SendAsync("NewRequest", notificationMessage);
            }

            if (await _unitOfWork.CompleteAsync()){
                var taxiToReturn = _mapper.Map<TaxiForUpdateDto>(taxiEntity);

                return CreatedAtRoute("GetTaxi", new { id = taxiToReturn.Id }, taxiToReturn);
            }

            throw new Exception("Creating the taxi failed on save");
        } 
                                 
    }
}