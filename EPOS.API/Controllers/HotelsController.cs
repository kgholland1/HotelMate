using System;
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
    [Authorize]
    [Route("api/[controller]")]
    public class HotelsController : Controller
    {
        private readonly IHotelRepository _hotelrepo;
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IAuthRepository _repo;
        public HotelsController(IHotelRepository hotelrepo, IAuthRepository repo, IMapper mapper, IUnitOfWork unitOfWork)
        {
            _repo = repo;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _hotelrepo = hotelrepo;
        }
        [HttpGet("{id}", Name = "GetHotel")]
        public async Task<IActionResult> GetHotel(int id)
        {
            var hotel = await _hotelrepo.GetHotelWithJustHotelPhotos(id);

            var hotelToReturn = _mapper.Map<HotelForUpdatesDto>(hotel);

            return Ok(hotelToReturn);
        }

        [AllowAnonymous]
        [HttpPost]
        public async Task<IActionResult> CreateHotel([FromBody] HotelForCreateDto hotelForCreateDto)
        {
            if (hotelForCreateDto == null)
            {
                return BadRequest();                      
            }

            //check fot no space in phone  
            if (!string.IsNullOrEmpty(hotelForCreateDto.Phone))
                hotelForCreateDto.Phone = hotelForCreateDto.Phone.Replace(" ", "");

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var hotelEntity = _mapper.Map<Hotel>(hotelForCreateDto);

            // Add all other missing fields here
            Random rnd = new Random();
            int code = rnd.Next(500, 100000);
            hotelEntity.HotelCode = hotelForCreateDto.HotelName.Substring(0, 3) + "HM" + code.ToString().Replace(" ", "");
            
            var hotelFromRepo = await _repo.HotelSignup(hotelEntity);

            //regieter the Admin user
            var userToCreate = new User
            {
                Username = hotelForCreateDto.username,
                Email = hotelForCreateDto.useremail,
                HotelId = hotelFromRepo.Id,
                Created = DateTime.UtcNow,
                LastActive = DateTime.UtcNow,
                Role = "Admin",
                Active = true
            };

            var createUser = await _repo.Register(userToCreate, hotelForCreateDto.userpassword);

            var UserWithClaims = await _repo.AddClaims(createUser);

            // //create the main Category
            // var newCategory = new Category();
            // newCategory.HotelId = hotelFromRepo.Id;
            // _hotelrepo.Add(newCategory);

            if (await _unitOfWork.CompleteAsync())
            {
                var hotelToReturn = _mapper.Map<HotelForUpdatesDto>(hotelFromRepo);
                return CreatedAtRoute("GetHotel", new { id = hotelToReturn.Id }, hotelToReturn);
            }

            throw new Exception("Creating the hotel failed on submit");
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateHotel(int id, [FromBody] HotelForUpdatesDto hotelForUpdatesDto)
        {
            if (hotelForUpdatesDto == null)
            {
                return BadRequest();
            }
            if (!string.IsNullOrEmpty(hotelForUpdatesDto.Phone))
                hotelForUpdatesDto.Phone = hotelForUpdatesDto.Phone.Replace(" ", "");

            hotelForUpdatesDto.Photos = null;
            
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var hotelFromRepo = await _hotelrepo.GetHotel(id);

            if (hotelFromRepo == null)
                return NotFound($"Could not find hotel with an ID of {id}");

            _mapper.Map(hotelForUpdatesDto, hotelFromRepo);

            if (await  _unitOfWork.CompleteAsync())
                return NoContent();

            throw new Exception($"Updating hotel {id} failed on save");
        }
    }
}