using System;
using System.Text;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Threading.Tasks;
using EPOS.API.Data;
using EPOS.API.Dtos;
using EPOS.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using EPOS.API.Helpers;
using System.Collections.Generic;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace EPOS.API.Controllers
{
    [AllowAnonymous]
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;
        private readonly IHotelRepository _hotelrepo;
        private readonly JwtSettings _config;
        private readonly IMapper _mapper;
        public AuthController(IHotelRepository hotelrepo, 
            JwtSettings jwt,
            IMapper mapper,
            UserManager<User> userManager,
            SignInManager<User> signInManager            
            )
        {
            _mapper = mapper;
            _config = jwt;
            _userManager = userManager;
            _signInManager = signInManager;
            _hotelrepo = hotelrepo;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(UserForRegisterDto userForRegisterDto)
        {
            var hotel = await _hotelrepo.GetHotelWithCode(userForRegisterDto.HotelCode);

            if (hotel == null)
                return NotFound($"Could not find hotel with code {userForRegisterDto.HotelCode}");

            var userToCreate = _mapper.Map<User>(userForRegisterDto);

            userToCreate.UserName = userForRegisterDto.Email;
            userToCreate.HotelId = hotel.Id;
            userToCreate.Created = DateTime.UtcNow;
            userToCreate.LastActive = DateTime.UtcNow;            

            var result = await _userManager.CreateAsync(userToCreate, userForRegisterDto.Password);

            if (result.Succeeded)
            {
                var roleResult = await _userManager.AddToRoleAsync(userToCreate, "Staff");

                var userToReturn = _mapper.Map<UserForListDto>(userToCreate);

                return CreatedAtRoute("GetUser", 
                    new { controller = "User", id = userToCreate.Id }, userToReturn);
            }

            return BadRequest(result.Errors);

        }
        
        // [ServiceFilter(typeof(LogUserActivity))]
        [HttpPost("login")]
        public async Task<IActionResult> Login(UserForLoginDto userForLoginDto)
        {
            var user = await _userManager.FindByEmailAsync(userForLoginDto.Email.ToLower());

            if (user == null)
                return Unauthorized();

            var result = await _signInManager
                .CheckPasswordSignInAsync(user, userForLoginDto.Password, false);

            if (result.Succeeded)
            {
                var appUser = await _userManager.Users
                    .FirstOrDefaultAsync(u => u.Email == userForLoginDto.Email.ToLower());

                var userToReturn = _mapper.Map<UserForSuccessfulDto>(appUser);

                return Ok(new
                {
                    token = GenerateJwtToken(appUser).Result,
                    user = userToReturn
                });
            }

            return Unauthorized();
        }

        [HttpPost("guestregister")]
        public async Task<IActionResult> GuestRegister(GuestForRegisterDto guestForRegisterDto)
        {

            var userToCreate = _mapper.Map<User>(guestForRegisterDto);

            userToCreate.UserName = guestForRegisterDto.Email;
            userToCreate.HotelId = 1;
            userToCreate.Created = DateTime.UtcNow;
            userToCreate.LastActive = DateTime.UtcNow;            

            var result = await _userManager.CreateAsync(userToCreate, guestForRegisterDto.Password);

            if (result.Succeeded)
            {
                var roleResult = await _userManager.AddToRoleAsync(userToCreate, "Guest");

                var userToReturn = _mapper.Map<UserForListDto>(userToCreate);

                return CreatedAtRoute("GetUser", 
                    new { controller = "User", id = userToCreate.Id }, userToReturn);
            }

            return BadRequest(result.Errors);

        }
       private async Task<string> GenerateJwtToken(User user)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.UserName)
            };

            var roles = await _userManager.GetRolesAsync(user);

            foreach (var role in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }

            var key = new SymmetricSecurityKey(Encoding.UTF8
                .GetBytes(_config.Key));

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddDays(_config.MinutesToExpiration),
                SigningCredentials = creds
            };

            var tokenHandler = new JwtSecurityTokenHandler();

            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }
 

    }
}