using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using EHL.Common.Models;

namespace EHL.Business.Interfaces
{
    public interface IDashboardManager
    {
        public Dashboard GetAllEmerCount(long wingId);
        public List<DashboardCategory> GetAllCategory(long wingId);
        public List<DashboardCategory> GetAllSubCategory(long wingId);
        public List<DashboardCategory> GetAllEqpt(long wingId);
        public List<DashOneYearCount> GetEmerMonthWiseCount(long wingId);
        public List<DashOneYearCount> GetPolicyMonthWiseCount(long wingId);
    }
}
