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

namespace EPOS.API.Controllers
{
    [Route("api/[controller]")]
    public class AuthController : Controller
    {
        private readonly IAuthRepository _repo;
        private readonly IHotelRepository _hotelrepo;
        private readonly JwtSettings _config;
        private readonly IMapper _mapper;
        public AuthController(IAuthRepository repo, IHotelRepository hotelrepo, JwtSettings jwt, IMapper mapper)
        {
            _mapper = mapper;
            _config = jwt;
            _repo = repo;
            _hotelrepo = hotelrepo;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody]UserForRegisterDto userForRegisterDto)
        {
            if (userForRegisterDto == null)
            {
                return BadRequest();
            }
            var hotel = await _hotelrepo.GetHotelWithCode(userForRegisterDto.HotelCode);

            if (hotel == null)
                return NotFound($"Could not find hotel with code {userForRegisterDto.HotelCode}");

            if (!string.IsNullOrEmpty(userForRegisterDto.Email))
                userForRegisterDto.Email = userForRegisterDto.Email.ToLower();

            if (await _repo.UserExists(userForRegisterDto.Email))
                ModelState.AddModelError("Email", "Email already exists");

            // validate request
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var userToCreate = new User
            {
                Username = userForRegisterDto.Username,
                Email = userForRegisterDto.Email,
                HotelId = hotel.Id,
                Created = DateTime.UtcNow,
                LastActive = DateTime.UtcNow,
                Role = "Staff",
                Active = true
            };

            var createUser = await _repo.Register(userToCreate, userForRegisterDto.Password);

            // temp: add claims here, will modify later
            var UserWithClaims = await _repo.AddClaims(createUser);

            return StatusCode(201);
        }
        
        [ServiceFilter(typeof(LogUserActivity))]
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody]UserForLoginDto userForLoginDto)
        {

            //throw new Exception("just checking files");
            var userFromRepo = await _repo.Login(userForLoginDto.Email.ToLower(), userForLoginDto.Password);

            if (userFromRepo == null)
                return Unauthorized();

            // Create standard JWT claims
            List<Claim> jwtClaims = new List<Claim>();
            jwtClaims.Add(new Claim(ClaimTypes.NameIdentifier, userFromRepo.Id.ToString()));
            jwtClaims.Add(new Claim(ClaimTypes.Name, userFromRepo.Username));


            // add hotelid to claims
/*             var hotelClaim = new UserClaim();
            hotelClaim.ClaimType = "hotelID";
            hotelClaim.ClaimValue = userFromRepo.HotelId.ToString();
            userFromRepo.Claims.Add(hotelClaim); */
             jwtClaims.Add(new Claim("hotelID", userFromRepo.HotelId.ToString()));

            // Add custom claims (security settings)
            foreach (var claim in userFromRepo.Claims)
            {
                jwtClaims.Add(new Claim(claim.ClaimType, claim.ClaimValue));
            }
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


            var userClaims = _mapper.Map<List<UserClaimsDto>>(userFromRepo.Claims);
            // add the hotel claim to claim list
            userClaims.Add(new UserClaimsDto {ClaimType = "HotelId", ClaimValue = userFromRepo.HotelId.ToString()});  
  

            return Ok(new { tokenString, userClaims });
        }
        [HttpGet("{id}", Name = "GetUser")]
        public async Task<IActionResult> GetUser(int id)
        {
            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);

            if (id != currentUserId)
               return Unauthorized();

            var userFromRepo = await _repo.GetUser(currentUserId);

            var userToReturn = _mapper.Map<ProfileForDetailDto>(userFromRepo);

            return Ok(userToReturn);
        }

        [ServiceFilter(typeof(LogUserActivity))]
        [HttpPut("profile")]
        public async Task<IActionResult> Profile([FromBody]ProfileForUpdateDto profileForUpdateDto)
        {
            if (profileForUpdateDto == null)
            {
                return BadRequest();
            }
            if (!string.IsNullOrEmpty(profileForUpdateDto.Email)) {
                profileForUpdateDto.Email = profileForUpdateDto.Email.ToLower();

                if  (profileForUpdateDto.Email !=  profileForUpdateDto.OldEmail.ToLower()) {

                    if (await _repo.UserExists(profileForUpdateDto.Email))
                        ModelState.AddModelError("Email", "Email already exists");
                }
            }


            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            var profileFromRepo = await _repo.GetUser(currentUserId);

            if (profileFromRepo == null)
                return NotFound("Could not find user");

            _mapper.Map(profileForUpdateDto, profileFromRepo);

            if (await  _repo.Save())
                return NoContent();

            throw new Exception("Updating profile failed on save");

        }
        [HttpPost("changepassword")]
        public async Task<IActionResult> ChangePassword([FromBody]PasswordChangeDto passwordChangeDto)
        {
            if (passwordChangeDto == null)
            {
                return BadRequest();
            }

            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            var userFromRepo = await _repo.GetUser(currentUserId);

            var changeState = await _repo.ChangePassword(userFromRepo, passwordChangeDto.CurrentPassword, 
                passwordChangeDto.NewPassword);

            if (!changeState)
                ModelState.AddModelError("currentPassword", "Current password provided does not exist");

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return NoContent();

            throw new Exception("Updating profile failed on save");

        }
        [HttpGet("Users")]
        public async Task<IActionResult> GetUsers([FromQuery]GeneralParams userParams)
        {
            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);

            var userFromRepo = await _repo.GetUser(currentUserId);

            var users = await _repo.GetUsers(userParams, userFromRepo.HotelId);

            var usersToReturn = _mapper.Map<IEnumerable<UserForListDto>>(users);

            Response.AddPagination(users.CurrentPage, users.PageSize, users.TotalCount, users.TotalPages);

            return Ok(usersToReturn);
        }
        [HttpGet("{id}/Systemuser")]
        public async Task<IActionResult> GetSystemUser(int id)
        {
            var userFromRepo = await _repo.GetUser(id);

            var userToReturn = _mapper.Map<UserForListDto>(userFromRepo);

            return Ok(userToReturn);
        }
        [HttpPut("users/{id}")]
        public async Task<IActionResult> UserRole(int id, [FromBody]UserForUpdateDto userForUpdateDto)
        {
            if (userForUpdateDto == null)
            {
                return BadRequest();
            }

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // update claims here
            if (userForUpdateDto.CurrentRole != userForUpdateDto.NewRole) {
                var userRemoveClaimsRepo = await _repo.RemoveClaims(id);
                var userAddClaimsRepo  = await _repo.AddClaimsForNewRole(id, userForUpdateDto.NewRole);
            }

            var userFromRepo = await _repo.GetUser(id);            
             _mapper.Map(userForUpdateDto, userFromRepo);

            if (await  _repo.Save())
                return NoContent();

            throw new Exception("Updating user failed on save");

        }  
        [HttpDelete("users/{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {

            var userFromRepo = await _repo.GetUser(id);
            
            if (userFromRepo == null)
                return NotFound();

            _repo.Delete(userFromRepo);

            if (await  _repo.Save())
                return NoContent();

            return BadRequest("Failed to delete the user");
        }      

    }
}