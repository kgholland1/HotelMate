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
    [Route("api/hotels/{hotelId}/rooms")]
    [ApiController] 
    public class RoomController : ControllerBase
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
        public async Task<IActionResult> GetRooms(int hotelId, [FromQuery]GeneralParams roomParams)
        {
            var rooms = await _hotelrepo.GetRooms(roomParams, hotelId);

            var roomsToReturn = _mapper.Map<IEnumerable<RoomForListDto>>(rooms);

            Response.AddPagination(rooms.CurrentPage, rooms.PageSize, rooms.TotalCount, rooms.TotalPages);

            return Ok(roomsToReturn);
        }  

        [HttpGet("{id}", Name = "GetRoom")]
        public async Task<IActionResult> GetRoom(int id)
        {
            var room = await _hotelrepo.GetRoom(id);

            if (room == null)
                return NotFound($"Could not find room with an ID of {id}");

            var roomToReturn = _mapper.Map<RoomForUpdateDto>(room);

            return Ok(roomToReturn);
        }   

        [HttpPost]
        public async Task<IActionResult> CreateRoom(int hotelId, RoomForUpdateDto roomForUpdateDto)
        {
            if (roomForUpdateDto == null)
            {
                return BadRequest();
            }
                
            var roomEntity = _mapper.Map<Room>(roomForUpdateDto);

            roomEntity.HotelId = hotelId;

            _hotelrepo.Add(roomEntity);

            if (await _unitOfWork.CompleteAsync()){
                var roomToReturn = _mapper.Map<RoomForUpdateDto>(roomEntity);
                return CreatedAtRoute("GetRoom", new { id = roomEntity.Id }, roomToReturn);
            }

            throw new Exception("Creating the room failed on save");
        }  

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateRoom(int id, RoomForUpdateDto roomForUpdateDto)
        {
            if (roomForUpdateDto == null)
            {
                return BadRequest();
            }            

            var roomFromRepo = await _hotelrepo.GetRoom(id);

            if (roomFromRepo == null)
                return NotFound($"Could not find room with an ID of {id}");

            _mapper.Map<RoomForUpdateDto, Room>(roomForUpdateDto, roomFromRepo);

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