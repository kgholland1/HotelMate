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
using System.Linq;
using System.Threading;

namespace EPOS.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController:  ControllerBase
    {

        private readonly UserManager<User> _userManager;
        private readonly IUserRepository _repo;
        private readonly IHotelRepository _hotelrepo;
        private readonly JwtSettings _config;
        private readonly IMapper _mapper;
        public UserController(IUserRepository repo, 
            IHotelRepository hotelrepo, 
            JwtSettings jwt, 
            IMapper mapper,
            UserManager<User> userManager)
        {
            _mapper = mapper;
            _config = jwt;
            _repo = repo;
            _hotelrepo = hotelrepo;
            _userManager = userManager;
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


        [HttpPut("profile")]
        public async Task<IActionResult> Profile(ProfileForUpdateDto profileForUpdateDto)
        {

            if (profileForUpdateDto == null)
            {
                return BadRequest();
            }

/*             if (!ModelState.IsValid)
                return BadRequest(ModelState); */

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

            var user = await  _userManager.GetUserAsync(HttpContext.User);
           
            if (user != null)
            {
                var result = await _userManager.ChangePasswordAsync(user, 
                    passwordChangeDto.CurrentPassword, passwordChangeDto.NewPassword);

                if (result.Succeeded)
                {
                    return NoContent();
                }
                else {
                    return BadRequest("Failed to change password.");
                }
            }           
            throw new Exception("Change password failed on save");
        }

        [Authorize(Policy = "RequireAdminRole")]
        [HttpGet("Users")]
        public async Task<IActionResult> GetUsers()
        {
            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);

            var userFromRepo = await _repo.GetUser(currentUserId);

            var users = await _repo.GetSystemUsers(userFromRepo.HotelId);

            return Ok(users);
        }
        [HttpGet("{id}/Systemuser")]
        public async Task<IActionResult> GetSystemUser(int id)
        {
            var userFromRepo = await _repo.GetUser(id);

            var userToReturn = _mapper.Map<UserForListDto>(userFromRepo);

            return Ok(userToReturn);
        }

        [Authorize(Policy = "RequireAdminRole")]
        [HttpPost("editRoles/{userName}")]
        public async Task<IActionResult> EditRoles(string userName, RoleEditDto roleEditDto)
        {
            var user = await _userManager.FindByNameAsync(userName);

            var userRoles = await _userManager.GetRolesAsync(user);

            var selectedRoles = roleEditDto.RoleNames;

            selectedRoles = selectedRoles ?? new string[] { };
            var result = await _userManager.AddToRolesAsync(user, selectedRoles.Except(userRoles));

            if (!result.Succeeded)
                return BadRequest("Failed to add to roles");

            result = await _userManager.RemoveFromRolesAsync(user, userRoles.Except(selectedRoles));

            if (!result.Succeeded)
                return BadRequest("Failed to remove the roles");

            return Ok(await _userManager.GetRolesAsync(user));
        }

        [Authorize(Policy = "RequireAdminRole")]
        [HttpDelete("users/{userName}")]
        public async Task<IActionResult> DeleteUser(string userName)
        {
            if (string.IsNullOrEmpty(userName))
            {
                 return BadRequest();
            }

            var user = await _userManager.FindByNameAsync(userName);  
            if (user == null) 
                 return BadRequest("Could not find user");

            var userRoles = await _userManager.GetRolesAsync(user);
            
            var result = await _userManager.RemoveFromRolesAsync(user, userRoles);

            if (!result.Succeeded)
                return BadRequest("Failed to remove roles");

            result = await _userManager.DeleteAsync(user);
            
            if (result.Succeeded)
                return NoContent();

            throw new Exception("Failed to delete the user");
        }
    }
}