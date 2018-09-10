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
    [Authorize]
    [Route("api/hotels/{hotelId}/restaurants")]
    public class RestaurantController  : Controller
    {
        private readonly ISystemRepository _repo;
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;

        public RestaurantController(ISystemRepository repo,  IMapper mapper, IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _repo = repo;
        }  
        [HttpGet]
        public async Task<IActionResult> GetRestaurants(int hotelId, [FromQuery]GeneralParams restaurantParams)
        {

            var restaurants = await _repo.GetRestaurants(restaurantParams, hotelId);

            var restaurantsToReturn = _mapper.Map<IEnumerable<RestaurantForListDto>>(restaurants);

            Response.AddPagination(restaurants.CurrentPage, restaurants.PageSize, restaurants.TotalCount, restaurants.TotalPages);

            return Ok(restaurantsToReturn);
        } 
        [HttpGet("{id}", Name = "GetRestaurant")]
        public async Task<IActionResult> GetRestaurant(int id)
        {
            var restaurant = await _repo.GetRestaurant(id);

            var restaurantToReturn = _mapper.Map<RestaurantForUpdateDto>(restaurant);

            return Ok(restaurantToReturn);
        }   
        [HttpPost]
        public async Task<IActionResult> CreateRestaurant(int hotelId, [FromBody] RestaurantForUpdateDto restaurantForUpdateDto)
        {
            if (restaurantForUpdateDto == null)
            {
                return BadRequest();
            }
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
                
            var restaurantEntity = _mapper.Map<Restaurant>(restaurantForUpdateDto);

            restaurantEntity.HotelId = hotelId;

            _repo.Add(restaurantEntity);

            if (await _unitOfWork.CompleteAsync()){
                var restaurantToReturn = _mapper.Map<RestaurantForUpdateDto>(restaurantEntity);
                return CreatedAtRoute("GetRestaurant", new { id = restaurantEntity.Id }, restaurantToReturn);
            }

            throw new Exception("Creating the restaurant failed on save");
        }     
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] RestaurantForUpdateDto restaurantForUpdateDto)
        {
            if (restaurantForUpdateDto == null)
            {
                return BadRequest();
            }
            
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var restaurantFromRepo = await _repo.GetRestaurant(id);

            if (restaurantFromRepo == null)
                return NotFound($"Could not find restaurant with an ID of {id}");

            _mapper.Map(restaurantForUpdateDto, restaurantFromRepo);

            if (await  _unitOfWork.CompleteAsync())
                return NoContent();

            throw new Exception($"Updating restaurant {id} failed on save");
        }     
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRestaurant(int id)
        {

            var restaurantFromRepo = await _repo.GetRestaurant(id);
            
            if (restaurantFromRepo == null)
                return NotFound();

            _repo.Delete(restaurantFromRepo);

            if (await  _unitOfWork.CompleteAsync())
                return NoContent();

            return BadRequest("Failed to delete the restaurant");
        }                                 
    }
}