using System.Collections.Generic;
using System.Linq;
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
    [Route("api/hotels/{hotelId}/photos")]
    public class PhotosController: Controller
    {
        private readonly IHotelRepository _hotelRepo;
        private readonly IMapper _mapper;
        private readonly IOptions<CloudinarySettings> _cloudinaryConfig;
        private readonly IUnitOfWork _unitOfWork;
        private Cloudinary _cloudinary;
        public PhotosController(IHotelRepository hotelRepo,
            IMapper mapper,
            IOptions<CloudinarySettings> cloudinaryConfig,
            IUnitOfWork unitOfWork)
        {
            _mapper = mapper;
            _hotelRepo = hotelRepo;
            _cloudinaryConfig = cloudinaryConfig;
            _unitOfWork = unitOfWork;

            Account acc = new Account(
                _cloudinaryConfig.Value.CloudName,
                _cloudinaryConfig.Value.ApiKey,
                _cloudinaryConfig.Value.ApiSecret
            );

            _cloudinary = new Cloudinary(acc);
        }   

        [HttpGet("{id}", Name = "GetPhoto")]
        public async Task<IActionResult> GetPhoto(int id)
        {
            var photoFromRepo = await _hotelRepo.GetPhoto(id);

            var photo = _mapper.Map<PhotoForReturnDto>(photoFromRepo);

            return Ok(photo);
        }
       [HttpPost("{photoType}/{photoTypeID}")]
        public async Task<IActionResult> AddPhoto(int hotelId, string photoType, int photoTypeID, PhotoForCreationDto photoDto)
        {
            if (photoDto == null)
            {
                return BadRequest();
            }

            photoDto.Description = GetDescription(photoType);

            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);

            var userFromRepo = await _hotelRepo.GetUser(currentUserId);

            if (userFromRepo == null)
                return BadRequest("Could not find user");

            // check if user belongs to hotel and get hotel
            if (userFromRepo.HotelId != hotelId)
                return Unauthorized();

            var hotelFromRepo = await _hotelRepo.GetHotel(hotelId, true);

            var file = photoDto.File;

            var uploadResult = new ImageUploadResult();

            if (file.Length > 0)
            {
                using (var stream = file.OpenReadStream())
                {
                    var uploadParams = new ImageUploadParams()
                    {
                        File = new FileDescription(file.Name, stream),
                        Transformation = new Transformation().Width(500).Height(500).Crop("fill").Gravity("face")
                    };

                    uploadResult = _cloudinary.Upload(uploadParams);
                }
            }

            photoDto.Url = uploadResult.Uri.ToString();
            photoDto.PublicId = uploadResult.PublicId;

            var photo = _mapper.Map<Photo>(photoDto);

            photo.hotel = hotelFromRepo;

            if (!hotelFromRepo.Photos.Any(m => m.IsMain && (m.PhotoType == photoDto.PhotoType) 
                && (m.PhotoTypeId == photoDto.PhotoTypeId)))
                photo.IsMain = true;

            hotelFromRepo.Photos.Add(photo);
           
            if (await _unitOfWork.CompleteAsync())
            {
                var photoToReturn = _mapper.Map<PhotoForReturnDto>(photo);
                return CreatedAtRoute("GetPhoto", new { id = photo.Id }, photoToReturn);
            }

            return BadRequest("Could not add the photo");
        }
        [HttpPost("{id}/setMain")]
        public async Task<IActionResult> SetMainPhoto(int id, int hotelId, [FromBody] PhotoForReturnDto photoDto)
        {

            var photoFromRepo = await _hotelRepo.GetPhoto(id);
            if (photoFromRepo == null)
                return NotFound();

            if (photoFromRepo.IsMain)
                return BadRequest("This is already the main photo");

            var currentMainPhoto = await _hotelRepo.GetMainPhotoForType(hotelId, photoDto.PhotoType, photoDto.PhotoTypeId);
            if (currentMainPhoto != null)
                currentMainPhoto.IsMain = false;

            photoFromRepo.IsMain = true;

            if (await _unitOfWork.CompleteAsync())
                return NoContent();

            return BadRequest("Could not set photo to main");
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePhoto(int hotelId, int id)
        {

            var photoFromRepo = await _hotelRepo.GetPhoto(id);
            if (photoFromRepo == null)
                return NotFound();

            if (photoFromRepo.PublicId != null)
            {
                var deleteParams = new DeletionParams(photoFromRepo.PublicId);

                var result = _cloudinary.Destroy(deleteParams);

                if (result.Result == "ok")
                    _hotelRepo.Delete(photoFromRepo);
            }
            else {
                 return BadRequest("Failed to delete the photo");
            }

            if (await _unitOfWork.CompleteAsync())
                return Ok();

            return BadRequest("Failed to delete the photo");
        }
     
        private string GetDescription(string photoType) {

        var result = "Hotel";

        switch (photoType)
        {
            case "Hotel":
                result = "Hotel";
                break;
            default:
                break;
        }

        return result;
        }
        
        [HttpGet("{TypeId}/{Type}")]
        public async Task<IActionResult> GetPhotos(int TypeId, int hotelId, string Type)
        {
            var photos = await _hotelRepo.GetPhotosForType(TypeId, hotelId, Type );

            var photoToReturn = _mapper.Map<IEnumerable<PhotoForReturnDto>>(photos);

            return Ok(photoToReturn);
        }
    }
}