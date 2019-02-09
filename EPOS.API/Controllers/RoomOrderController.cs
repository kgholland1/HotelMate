using AutoMapper;
using EPOS.API.Data;
using EPOS.API.Dtos;
using EPOS.API.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using EPOS.API.Hubs;
using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;
using System.Security.Claims;
using EPOS.API.Models;
using System;

namespace EPOS.API.Controllers
{
    [Route("api/hotels/{hotelId}/roomOrder")]
    [ApiController]  
    public class RoomOrderController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork; 
        private readonly IMenuRepository _repo;
        private readonly IHotelRepository _hotelrepo;  
        private readonly IHubContext<NotificationsHub> _notifyHub;
        private readonly IBookingRepository _bookingrepo;
        public RoomOrderController(IMenuRepository repo, IMapper mapper, IUnitOfWork unitOfWork, 
            IHubContext<NotificationsHub> notifyHub, IBookingRepository bookingrepo, IHotelRepository hotelrepo)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _notifyHub = notifyHub;
            _bookingrepo = bookingrepo;
            _repo = repo;   
            _hotelrepo = hotelrepo;         
        } 

        [HttpPost()]
        public async Task<IActionResult> CreateOrder(MenuOrderCreateDto menuOrderCreateDto)
        {
            if (menuOrderCreateDto == null)
            {
                return BadRequest();
            }

            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);

            // booking details
            var bookingFromRepo  = await _bookingrepo.GuestCurrentBooking(currentUserId);
            
            if (bookingFromRepo == null)
                return NotFound($"Could not find guest booking");

            var menuOrderEntity = _mapper.Map<MenuOrder>(menuOrderCreateDto);

            menuOrderEntity.GuestName = bookingFromRepo.GuestName;
            menuOrderEntity.Email = bookingFromRepo.Email;
            menuOrderEntity.Phone = bookingFromRepo.Phone;
            menuOrderEntity.RoomNumber = bookingFromRepo.RoomNumber;
            menuOrderEntity.OrderStatus = "Pending";
            menuOrderEntity.IsDeleted = false;
            menuOrderEntity.BookingId = bookingFromRepo.Id;
            menuOrderEntity.HotelId = bookingFromRepo.HotelId;          
            _repo.Add(menuOrderEntity);

            /// signalR section to copy out
            var notificationFromRepo = await _hotelrepo.GetNotificationCounters(bookingFromRepo.HotelId);

            if (notificationFromRepo != null)
            {
                notificationFromRepo.OrderCount +=1; 

                var notificationToReturn = _mapper.Map<NotificationDto>(notificationFromRepo);               

                var notificationMessage = NotificationMessage.CreateNotification(bookingFromRepo.HotelId, "Order",
                    menuOrderEntity.RoomNumber, notificationToReturn);

                await _notifyHub.Clients.All.SendAsync("NewRequest", notificationMessage);
            }

            if (await _unitOfWork.CompleteAsync()){
                var MenuOrderToReturn = _mapper.Map<MenuOrderUpdateDto>(menuOrderEntity);

                return CreatedAtRoute("GetMenuOrder", new { id = MenuOrderToReturn.Id }, MenuOrderToReturn);
            }

            throw new Exception("Creating the taxi failed on save");
        } 

        [HttpGet("{id}", Name = "GetMenuOrder")]
        public async Task<IActionResult> GetOrder(int Id)
        {
            var OrderFromRepo = await _repo.GetMenuOrder(Id);

            if (OrderFromRepo == null)
                return NotFound($"Could not find order with an ID of {Id}");

            var orderToReturn = _mapper.Map<MenuOrderUpdateDto>(OrderFromRepo);

            return Ok(orderToReturn);
        }                                 
    }
}