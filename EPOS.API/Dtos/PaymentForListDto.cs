namespace EPOS.API.Dtos
{
    public class PaymentForListDto
    {
        public int Id { get; set; }
        public string PaymentName { get; set; }
        public decimal Charge { get; set; }          
    }
}