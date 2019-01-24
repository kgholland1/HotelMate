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
    [Route("api/[controller]")]
    public class MenuController : Controller
    {
        private readonly IMenuRepository _repo;
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHotelRepository _hotelrepo;

        public MenuController(IMenuRepository repo, IHotelRepository hotelrepo, IMapper mapper, IUnitOfWork unitOfWork)
        {
            _hotelrepo = hotelrepo;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _repo = repo;
        } 
        [HttpGet]
        public async Task<IActionResult> GetMenus([FromQuery]CategoryParams categoryParams)
        {

            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);

            var userFromRepo = await _hotelrepo.GetUser(currentUserId);

            var menus = await _repo.GetMenus(categoryParams, userFromRepo.HotelId);

            var menusToReturn = _mapper.Map<IEnumerable<MenuForListDto>>(menus);

            Response.AddPagination(menus.CurrentPage, menus.PageSize, menus.TotalCount, menus.TotalPages);

            return Ok(menusToReturn);
        } 

        
        [HttpGet("{id}", Name = "GetMenu")]
        public async Task<IActionResult> GetMenu(int id)
        {
            var menu = await _repo.GetMenu(id);

            var menuToReturn = _mapper.Map<MenuForUpdateDto>(menu);

            return Ok(menuToReturn);
        }     
        [HttpPost("{hotelId}")]
        public async Task<IActionResult> CreateMenu(int hotelId, [FromBody] MenuForSaveDto menuForSaveDto)
        {
            if (menuForSaveDto == null)
            {
                return BadRequest();
            }
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
                
            var menuEntity = _mapper.Map<Menu>(menuForSaveDto);

            menuEntity.HotelId = hotelId;

            _repo.Add(menuEntity);

            if (await _unitOfWork.CompleteAsync()){
                var menu = await _repo.GetMenu(menuEntity.Id);
                var menuToReturn = _mapper.Map<MenuForUpdateDto>(menu);
                return CreatedAtRoute("GetMenu", new { id = menuEntity.Id }, menuToReturn);
            }

            throw new Exception("Creating the menu failed on save");
        } 
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateMenu(int id, [FromBody] MenuForSaveDto menuForSaveDto)
        {
            if (menuForSaveDto == null)
            {
                return BadRequest();
            }
            
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var menuFromRepo = await _repo.GetMenu(id);
 
            if (menuFromRepo == null)
                return NotFound($"Could not find menu with an ID of {id}");

                _mapper.Map<MenuForSaveDto, Menu>(menuForSaveDto, menuFromRepo);

            if (await  _unitOfWork.CompleteAsync())
                return NoContent(); 

            throw new Exception($"Updating menu {id} failed on save");
        } 
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMenu(int id)
        {

            var menuFromRepo = await _repo.GetMenu(id);
            
            if (menuFromRepo == null)
                return NotFound();

            _repo.Delete(menuFromRepo);

            if (await  _unitOfWork.CompleteAsync())
                return NoContent();

            return BadRequest("Failed to delete the menu method");
        }               
    }
}