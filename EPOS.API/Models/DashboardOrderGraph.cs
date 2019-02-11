using System.Collections.Generic;
using System.Collections.ObjectModel;

namespace EPOS.API.Models
{
    public class DashboardOrderGraph
    {
        public string selectedPeriod { get; set; }        
        public string[]  DataLabels { get; set; } = new string[31];
        public int[] DataCounters { get; set; } = new int[31];         
    }

        public class GraphResult
    {
        public string OrderDate { get; set; }     
        public int OrderCount { get; set; }   
    }
}