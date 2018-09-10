using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using EPOS.API.Data;
using EPOS.API.Dtos;
using EPOS.API.Helpers;
using EPOS.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace EPOS.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]    
    public class TouristsController : Controller
    {
        private readonly IHotelRepository _hotelrepo;
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        private Cloudinary _cloudinary;
        private readonly IOptions<CloudinarySettings> _cloudinaryConfig;

        public TouristsController(IHotelRepository hotelrepo, IMapper mapper, 
            IUnitOfWork unitOfWork, IOptions<CloudinarySettings> cloudinaryConfig)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _hotelrepo = hotelrepo; 
            _cloudinaryConfig = cloudinaryConfig;

            Account acc = new Account(
                _cloudinaryConfig.Value.CloudName,
                _cloudinaryConfig.Value.ApiKey,
                _cloudinaryConfig.Value.ApiSecret
            );

            _cloudinary = new Cloudinary(acc);                                  
           
        }
        [HttpGet]
        public async Task<IActionResult> GetTourists([FromQuery]GeneralParams touristParams)
        {

            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);

            var userFromRepo = await _hotelrepo.GetUser(currentUserId);

            var tourists = await _hotelrepo.GetTourists(touristParams, userFromRepo.HotelId);

            var touristsToReturn = _mapper.Map<IEnumerable<TouristForListDto>>(tourists);

            Response.AddPagination(tourists.CurrentPage, tourists.PageSize, tourists.TotalCount, tourists.TotalPages);

            return Ok(touristsToReturn);
        } 

        [HttpGet("{id}", Name = "GetTourist")]
        public async Task<IActionResult> GetTourist(int id)
        {
            var tourist = await _hotelrepo.GetTourist(id);

            var touristToReturn = _mapper.Map<TouristForUpdateDto>(tourist);

            // get the photos for this tourist
            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);

            var userFromRepo = await _hotelrepo.GetUser(currentUserId);

            var photos = await _hotelrepo.GetPhotosForType(id, userFromRepo.HotelId, tourist.TouristType );

             var photoToReturn = _mapper.Map<IEnumerable<PhotoForReturnDto>>(photos);

            return Ok(new { touristToReturn, photoToReturn });
        } 

        [HttpPost("{hotelId}")]
        public async Task<IActionResult> CreateTourist(int hotelId, [FromBody] TouristForUpdateDto touristForUpdateDto)
        {
            if (touristForUpdateDto == null)
            {
                return BadRequest();
            }
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
                
            var touristEntity = _mapper.Map<Tourist>(touristForUpdateDto);

            touristEntity.HotelId = hotelId;

            _hotelrepo.Add(touristEntity);

            if (await _unitOfWork.CompleteAsync()){
                var touristToReturn = _mapper.Map<TouristForUpdateDto>(touristEntity);
                return CreatedAtRoute("GetTourist", new { id = touristToReturn.Id }, touristToReturn);
            }

            throw new Exception("Creating the torist guide failed on save");
        } 

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTourist(int id, [FromBody] TouristForUpdateDto touristForUpdateDto)
        {
            
            if (touristForUpdateDto == null)
            {
                return BadRequest();
            }
            
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var touristFromRepo = await _hotelrepo.GetTourist(id);

            if (touristFromRepo == null)
                return NotFound($"Could not find tourist guide with an ID of {id}");

            _mapper.Map(touristForUpdateDto, touristFromRepo);

            if (await  _unitOfWork.CompleteAsync())
                return NoContent();

            throw new Exception($"Updating tourist guide {id} failed on save");
        }   
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTourist(int id)
        {

            var touristFromRepo = await _hotelrepo.GetTourist(id);
            
            if (touristFromRepo == null)
                return NotFound();

            // delete all photos first
            var photosFromRepo = await _hotelrepo.GetPhotosForType(touristFromRepo.Id, 
                touristFromRepo.HotelId, touristFromRepo.TouristType);
            
            foreach (Photo photo in photosFromRepo)
            {
                if (photo.PublicId != null)
                {
                    var deleteParams = new DeletionParams(photo.PublicId);

                    var result = _cloudinary.Destroy(deleteParams);

                    if (result.Result == "ok")
                        _hotelrepo.Delete(photo);
                }
                else {
                    return BadRequest("Failed to delete the tourist guide");
                }                
                _hotelrepo.Delete(photo);
            }
            

            _hotelrepo.Delete(touristFromRepo);

            if (await  _unitOfWork.CompleteAsync())
                return NoContent();

            return BadRequest("Failed to delete the tourist guide");
        }    
    }
}