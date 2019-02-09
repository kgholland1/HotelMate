using System.Threading.Tasks;
using AutoMapper;
using EPOS.API.Data;
using EPOS.API.Dtos;
using EPOS.API.Hubs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace EPOS.API.Controllers
{
    [AllowAnonymous]
    [Route("api/[controller]")]
    public class OrdersController : Controller
    {
        private readonly IMenuRepository _repo;
        private readonly IHotelRepository _hotelrepo;
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHubContext<NotificationsHub> _notifyHub;

        public OrdersController(IMenuRepository repo, IHotelRepository hotelrepo, 
            IMapper mapper, IUnitOfWork unitOfWork, IHubContext<NotificationsHub> notifyHub)
        {
            _unitOfWork = unitOfWork;
            _notifyHub = notifyHub;
            _mapper = mapper;
            _repo = repo;
            _hotelrepo = hotelrepo;
        }  

        [HttpGet("{id}", Name = "GetOrder")]
        public async Task<IActionResult> GetOrder(int id)
        {
            var extra = await _repo.GetExtra(id);

            var extraToReturn = _mapper.Map<ExtraForUpdateDto>(extra);

            /// signalR section to copy out
            NotificationMessage notificationToReturn = null;

            var notificationFromRepo = await _hotelrepo.GetNotificationCounters(1);

            if (notificationFromRepo != null)
            {
                notificationFromRepo.OrderCount +=1;
                await  _unitOfWork.CompleteAsync();  

                var notificationDto= _mapper.Map<NotificationDto>(notificationFromRepo);               

                notificationToReturn = NotificationMessage.CreateNotification(1, "Order",
                    "411", notificationDto);

                await _notifyHub.Clients.All.SendAsync("NewRequest", notificationToReturn);
            }            

            return Ok(notificationToReturn);
        }    
    }
}