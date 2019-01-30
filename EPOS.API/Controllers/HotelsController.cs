using System;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using EPOS.API.Data;
using EPOS.API.Dtos;
using EPOS.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace EPOS.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]   
    public class HotelsController : ControllerBase
    {
        private readonly IHotelRepository _hotelrepo;
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        private readonly UserManager<User> _userManager;
        private readonly RoleManager<Role> _roleManager;     

        public HotelsController(IHotelRepository hotelrepo, 
            IMapper mapper, 
            IUnitOfWork unitOfWork,
            UserManager<User> userManager, 
            RoleManager<Role> roleManager            
            )
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _hotelrepo = hotelrepo;
            _userManager = userManager;
            _roleManager = roleManager;            
        }
        
        [HttpGet("{id}", Name = "GetHotel")]
        public async Task<IActionResult> GetHotel(int id)
        {
            var hotel = await _hotelrepo.GetHotelWithJustHotelPhotos(id);

            if (hotel == null)
                return NotFound($"Could not find hotel with an ID of {id}");

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
            hotelEntity.CreatedBy = hotelForCreateDto.fullname;
            
            var hotelFromRepo =  await _hotelrepo.HotelSignup(hotelEntity);

            //register the Admin user
            var adminUser = new User
            {
                UserName = hotelForCreateDto.useremail,
                Email = hotelForCreateDto.useremail,
                FullName = hotelForCreateDto.fullname,
                HotelId = hotelFromRepo.Id,
                Created = DateTime.UtcNow,
                LastActive = DateTime.UtcNow,                    
            };

            IdentityResult result =  _userManager.CreateAsync(adminUser, "password").Result;
            if (result.Succeeded)
            {
                var admin = _userManager.FindByEmailAsync(hotelForCreateDto.useremail).Result;
                await _userManager.AddToRolesAsync(admin, new[] {"Admin"});             
            } else {
                BadRequest("Failed to create Admin user.");
            }

            var hotelToReturn = _mapper.Map<HotelForUpdatesDto>(hotelFromRepo);
            return CreatedAtRoute("GetHotel", new { id = hotelToReturn.Id }, hotelToReturn);

            throw new Exception("Creating the hotel failed on submit");
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateHotel(int id, HotelForUpdatesDto hotelForUpdatesDto)
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