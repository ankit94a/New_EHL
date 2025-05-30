using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace EHL.Common.Models
{

    public class Dashboard : Base
    {
        public int WingId { get; set; }
        public int WingEmerCount { get; set; }
        public int TotalEmerCount { get; set; }
        public int SixMonthWingEmerCount { get; set; }

    }
    public class DashboardCategory
    {
        //public int WingId { get; set; }
        public string name { get; set; }
    

    }
    public class DashOneYearCount : Base
    {
        public int count { get; set; }
        public string MonthName { get; set; }

    }

}
