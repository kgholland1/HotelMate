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
    public class RoomController : Controller
    {
        private readonly IHotelRepository _hotelrepo;
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        public RoomController(IHotelRepository hotelrepo, IMapper mapper, IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _hotelrepo = hotelrepo;
        } 

        [HttpGet]
        public async Task<IActionResult> GetRooms([FromQuery]GeneralParams roomParams)
        {

            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);

            var userFromRepo = await _hotelrepo.GetUser(currentUserId);

            var rooms = await _hotelrepo.GetRooms(roomParams, userFromRepo.HotelId);

            var roomsToReturn = _mapper.Map<IEnumerable<RoomForListDto>>(rooms);

            Response.AddPagination(rooms.CurrentPage, rooms.PageSize, rooms.TotalCount, rooms.TotalPages);

            return Ok(roomsToReturn);
        }  

        [HttpGet("{id}", Name = "GetRoom")]
        public async Task<IActionResult> GetRoom(int id)
        {
            var room = await _hotelrepo.GetRoom(id);

            var roomToReturn = _mapper.Map<RoomForUpdateDto>(room);

            return Ok(roomToReturn);
        }   

        [HttpPost]
        public async Task<IActionResult> CreateRoom([FromBody] RoomForUpdateDto roomForUpdateDto)
        {
            if (roomForUpdateDto == null)
            {
                return BadRequest();
            }
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // retieve the hotel id from the login user
            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);

            var userFromRepo = await _hotelrepo.GetUser(currentUserId);
                
            var roomEntity = _mapper.Map<Room>(roomForUpdateDto);

            roomEntity.HotelId = userFromRepo.HotelId;

            _hotelrepo.Add(roomEntity);

            if (await _unitOfWork.CompleteAsync()){
                var roomToReturn = _mapper.Map<RoomForUpdateDto>(roomEntity);
                return CreatedAtRoute("GetRoom", new { id = roomEntity.Id }, roomToReturn);
            }

            throw new Exception("Creating the room failed on save");
        }  

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateRoom(int id, [FromBody] RoomForUpdateDto roomForUpdateDto)
        {
            if (roomForUpdateDto == null)
            {
                return BadRequest();
            }
            
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var roomFromRepo = await _hotelrepo.GetRoom(id);

            if (roomFromRepo == null)
                return NotFound($"Could not find room with an ID of {id}");

            _mapper.Map(roomForUpdateDto, roomFromRepo);

            if (await  _unitOfWork.CompleteAsync())
                return NoContent();

            throw new Exception($"Updating room {id} failed on save");
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRoom(int id)
        {

            var roomFromRepo = await _hotelrepo.GetRoom(id);
            
            if (roomFromRepo == null)
                return NotFound();

            _hotelrepo.Delete(roomFromRepo);

            if (await  _unitOfWork.CompleteAsync())
                return NoContent();

            return BadRequest("Failed to delete the room");
        }
    }
}