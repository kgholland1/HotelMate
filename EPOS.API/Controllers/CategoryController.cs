using System.Threading.Tasks;
using EPOS.API.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using AutoMapper;
using EPOS.API.Helpers;
using System.Collections.Generic;
using EPOS.API.Dtos;
using System.Security.Claims;
using EPOS.API.Models;
using System;

namespace EPOS.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]  
    public class CategoryController : ControllerBase
    {
        private readonly IMenuRepository _repo;
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHotelRepository _hotelrepo;

        public CategoryController(IMenuRepository repo, IHotelRepository hotelrepo, IMapper mapper, IUnitOfWork unitOfWork)
        {
            _hotelrepo = hotelrepo;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _repo = repo;
        }

        [HttpGet("hotel/{hotelId}")]
        public async Task<IActionResult> GetCategories(int hotelId, [FromQuery]CategoryParams categoryParams)
        {

            var categories = await _repo.GetCategories(categoryParams, hotelId);

            var categoriesToReturn = _mapper.Map<IEnumerable<CategoryForListDto>>(categories);

            Response.AddPagination(categories.CurrentPage, categories.PageSize, categories.TotalCount, categories.TotalPages);

            return Ok(categoriesToReturn);
        }

        [HttpGet("{id}", Name = "GetCategory")]
        public async Task<IActionResult> GetCategory(int id)
        {
            var category = await _repo.GetCategory(id);

            var categoryToReturn = _mapper.Map<CategoryForUpdateDto>(category);
            
            if (categoryToReturn == null)
                return NotFound($"Could not find category with an ID of {id}");

            return Ok(categoryToReturn);
        }
        [HttpPost("hotel/{hotelId}")]
        public async Task<IActionResult> CreateCategory(int hotelId, CategoryForUpdateDto categoryForUpdateDto)
        {
            if (categoryForUpdateDto == null)
            {
                return BadRequest();
            }
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
                
            var categoryEntity = _mapper.Map<Category>(categoryForUpdateDto);

            categoryEntity.HotelId = hotelId;

            _repo.Add(categoryEntity);

            if (await _unitOfWork.CompleteAsync()){
                var categoryToReturn = _mapper.Map<CategoryForUpdateDto>(categoryEntity);
                return CreatedAtRoute("GetCategory", new { id = categoryEntity.Id }, categoryToReturn);
            }

            throw new Exception("Creating the category failed on save");
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCategory(int id, CategoryForUpdateDto categoryForUpdateDto)
        {
            if (categoryForUpdateDto == null)
            {
                return BadRequest();
            }
            
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var categoryFromRepo = await _repo.GetCategory(id);

            if (categoryFromRepo == null)
                return NotFound($"Could not find category with an ID of {id}");

            _mapper.Map(categoryForUpdateDto, categoryFromRepo);

            if (await  _unitOfWork.CompleteAsync())
                return NoContent();

            throw new Exception($"Updating category {id} failed on save");
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCategory(int id)
        {

            var categoryFromRepo = await _repo.GetCategory(id);
            
            if (categoryFromRepo == null)
                return NotFound();

            var menuCount = await _repo.GetMenusByCategory(id);

            if (menuCount != 0)
                return BadRequest("Menu(s) are attached to this category. Deletion is not allowed.");


            _repo.Delete(categoryFromRepo);

            if (await  _unitOfWork.CompleteAsync())
                return NoContent();

            return BadRequest("Failed to delete the category method");
        } 
        [HttpGet("{hotelId}/KeyValue")]  
        public async Task<IEnumerable<KeyValuePairDto>> GetCatForDropdown(int hotelId)
        {
        var categories = await _repo.GetCatKeyValuePair(hotelId);

        return categories;
        }     
    }
}