using System.Collections.Generic;

namespace EPOS.API.Dtos
{
    public class OpenTimesDto
    {
        public string OpenType { get; set; }
        public List<StringValuePairDto> OpenHours { get; set; } = new List<StringValuePairDto>();
    }
}