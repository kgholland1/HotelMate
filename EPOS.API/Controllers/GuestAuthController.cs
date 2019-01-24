using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using EPOS.API.Data;
using EPOS.API.Dtos;
using EPOS.API.Helpers;
using EPOS.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace EPOS.API.Controllers
{
    [AllowAnonymous]
    [Route("api/[controller]")]
    public class GuestAuthController : Controller
    {
        private readonly IAuthRepository _repo;
        private readonly JwtSettings _config;
        private readonly IMapper _mapper;
        public GuestAuthController(IAuthRepository repo, JwtSettings jwt, IMapper mapper)
        {
            _mapper = mapper;
            _config = jwt;
            _repo = repo;

        }     

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody]GuestForRegisterDto guestForRegisterDto)
        {
            if (guestForRegisterDto == null)
            {
                return BadRequest();
            }

            if (!string.IsNullOrEmpty(guestForRegisterDto.Email))
                guestForRegisterDto.Email = guestForRegisterDto.Email.ToLower();

            if (await _repo.GuestExists(guestForRegisterDto.Email))
                ModelState.AddModelError("Email", "Email already exists");

            // validate request
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var guestEntity = _mapper.Map<Guest>(guestForRegisterDto);

            guestEntity.Created = DateTime.Now;
            guestEntity.LastActive = DateTime.Now;

            var createGuest = await _repo.RegisterGuest(guestEntity, guestForRegisterDto.Password);

            return StatusCode(201);
        } 
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody]GuestForLoginDto guestForLoginDto)
        {

            var guestFromRepo = await _repo.GuestLogin(guestForLoginDto.Email.ToLower(), guestForLoginDto.Password);

            if (guestFromRepo == null)
                return Unauthorized();

            // Create standard JWT claims
            List<Claim> jwtClaims = new List<Claim>();
            jwtClaims.Add(new Claim(ClaimTypes.NameIdentifier, guestFromRepo.Id.ToString()));
            jwtClaims.Add(new Claim(ClaimTypes.Name, guestFromRepo.Fullname));

            // generate token
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_config.Key);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(jwtClaims),
                Expires = DateTime.Now.AddMinutes(_config.MinutesToExpiration),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key),
                    SecurityAlgorithms.HmacSha512Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            var tokenString = tokenHandler.WriteToken(token);

            return Ok(new { tokenString });
        }  
    }
}