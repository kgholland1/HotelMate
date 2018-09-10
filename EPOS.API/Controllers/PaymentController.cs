using System;
using System.Collections.Generic;
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
    [Authorize]
    [Route("api/hotels/{hotelId}/payments")]
    public class PaymentController : Controller
    {
        private readonly ISystemRepository _repo;
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;

        public PaymentController(ISystemRepository repo,  IMapper mapper, IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _repo = repo;
        }  

        [HttpGet]
        public async Task<IActionResult> GetPayments(int hotelId, [FromQuery]GeneralParams paymentParams)
        {

            var payments = await _repo.GetPayments(paymentParams, hotelId);

            var paymentsToReturn = _mapper.Map<IEnumerable<PaymentForListDto>>(payments);

            Response.AddPagination(payments.CurrentPage, payments.PageSize, payments.TotalCount, payments.TotalPages);

            return Ok(paymentsToReturn);
        }
        [HttpGet("{id}", Name = "GetPayment")]
        public async Task<IActionResult> GetPayment(int id)
        {
            var payment = await _repo.GetPayment(id);

            var paymentToReturn = _mapper.Map<PaymentForUpdateDto>(payment);

            return Ok(paymentToReturn);
        }

        [HttpPost]
        public async Task<IActionResult> CreatePayment(int hotelId, [FromBody] PaymentForUpdateDto paymentForUpdateDto)
        {
            if (paymentForUpdateDto == null)
            {
                return BadRequest();
            }
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
                
            var paymentEntity = _mapper.Map<Payment>(paymentForUpdateDto);

            paymentEntity.HotelId = hotelId;

            _repo.Add(paymentEntity);

            if (await _unitOfWork.CompleteAsync()){
                var paymentToReturn = _mapper.Map<PaymentForUpdateDto>(paymentEntity);
                return CreatedAtRoute("GetPayment", new { id = paymentEntity.Id }, paymentToReturn);
            }

            throw new Exception("Creating the payment failed on save");
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePayment(int id, [FromBody] PaymentForUpdateDto paymentForUpdateDto)
        {
            if (paymentForUpdateDto == null)
            {
                return BadRequest();
            }
            
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var paymentFromRepo = await _repo.GetPayment(id);

            if (paymentFromRepo == null)
                return NotFound($"Could not find payment with an ID of {id}");

            _mapper.Map(paymentForUpdateDto, paymentFromRepo);

            if (await  _unitOfWork.CompleteAsync())
                return NoContent();

            throw new Exception($"Updating payment {id} failed on save");
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePayment(int id)
        {

            var paymentFromRepo = await _repo.GetPayment(id);
            
            if (paymentFromRepo == null)
                return NotFound();

            _repo.Delete(paymentFromRepo);

            if (await  _unitOfWork.CompleteAsync())
                return NoContent();

            return BadRequest("Failed to delete the payment method");
        }
    }
}