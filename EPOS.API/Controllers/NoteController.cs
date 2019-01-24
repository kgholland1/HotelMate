using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using EPOS.API.Data;
using EPOS.API.Dtos;
using EPOS.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EPOS.API.Controllers
{
    [Route("api/[controller]")]
    public class NoteController  : Controller
    {
 
        private readonly IBookingRepository _repo;
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHotelRepository _hotelrepo;
        public NoteController(IBookingRepository repo,  IHotelRepository hotelrepo, IMapper mapper, IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _repo = repo;
            _hotelrepo = hotelrepo;
        }  
         [HttpGet("{bookingId}")]
        public async Task<IActionResult> GetNotes(int bookingId)
        {
            var notes = await _repo.GetNotes(bookingId);

            var notesToReturn = _mapper.Map<IEnumerable<NoteforListDto>>(notes);

            return Ok(notesToReturn);
        }
        [HttpGet("{id}", Name = "GetNote")]
        public async Task<IActionResult> GetNote(int id)
        {
            var note = await _repo.GetNote(id);

            var noteToReturn = _mapper.Map<NoteforListDto>(note);

            return Ok(noteToReturn);
        }
         [HttpPost()]        
        public async Task<IActionResult> CreateNote([FromBody] NoteforListDto noteForUpdateDto)
        {
            if (noteForUpdateDto == null)
            {
                return BadRequest();
            }
            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);

            var userFromRepo = await _hotelrepo.GetUser(currentUserId);
            noteForUpdateDto.CreatedOn = DateTime.Now;
            noteForUpdateDto.CreatedBy = userFromRepo.UserName;            

            var noteEntity = _mapper.Map<Note>(noteForUpdateDto);

            _repo.Add(noteEntity);

            if (await _unitOfWork.CompleteAsync()){
                var noteToReturn = _mapper.Map<NoteforListDto>(noteEntity);
                return CreatedAtRoute("GetNote", new { id = noteEntity.Id }, noteToReturn);
            }

            throw new Exception("Creating the note failed on save");
        }                   
    }
}