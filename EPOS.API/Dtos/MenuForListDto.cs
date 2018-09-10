namespace EPOS.API.Dtos
{
    public class MenuForListDto
    {
        
        public int Id { get; set; }
        public string CatName { get; set; }
        public string MenuCode { get; set; }
        public int MenuSortNumber { get; set; }
        public string MenuName { get; set; }
        public string MenuSubName { get; set; }
        public decimal UnitPrice { get; set; }
    }
}