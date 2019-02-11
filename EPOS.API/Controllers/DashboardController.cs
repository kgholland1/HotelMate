using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using EPOS.API.Data;
using Microsoft.AspNetCore.Mvc;
using EPOS.API.Dtos;

namespace EPOS.API.Controllers
{
    [Route("api/hotels/{hotelId}/dashboard")]   
    [ApiController]   
    public class DashboardController : ControllerBase
    {
        private readonly IHotelRepository _hotelrepo;
        private readonly IMapper _mapper;

        public DashboardController(IHotelRepository hotelrepo, IMapper mapper)
        {
            _hotelrepo = hotelrepo;
            _mapper = mapper;
        }  

        [HttpGet("summary")]
        public async Task<IActionResult> GetSummary(int hotelId)
        {
            var counters = await _hotelrepo.GetSummaryCounters(hotelId);

            return Ok(counters);
        } 
        [HttpGet("orderGraph")]
        public async Task<IActionResult> GetOrdersForGraph(int hotelId)
        {
            var OrdersPerDay = await _hotelrepo.GetOrdersGraph(hotelId);

            return Ok(OrdersPerDay);
        } 
        [HttpGet("orderLatest")]
        public async Task<IActionResult> GetLatestMenuOrders(int hotelId)
        {
            var orders = await _hotelrepo.GetLatestOrders(hotelId);
            
            var menusToReturn = _mapper.Map<IEnumerable<MenuOrderListDto>>(orders);

            return Ok(menusToReturn);
        }      
    }
}