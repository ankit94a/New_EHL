using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using EHL.Business.Interfaces;
using EHL.Common.Models;
using EHL.DB.Implements;
using EHL.DB.Interfaces;


namespace EHL.Business.Implements
{
    public class DashboardManager : IDashboardManager
    {
        private readonly IDashboardDB _dashboardDb;
        public DashboardManager(IDashboardDB dashboardDB)
        {
            _dashboardDb = dashboardDB;
        }
        public Dashboard GetAllEmerCount(long wingId)
        {
            return _dashboardDb.GetAllEmerCount(wingId);
        }
        public List<DashboardCategory> GetAllCategory(long wingId)
        {
            return _dashboardDb.GetAllCategory(wingId);
        }
        public List<DashboardCategory> GetAllSubCategory(long wingId)
        {
            return _dashboardDb.GetAllSubCategory(wingId);
        }
        public List<DashboardCategory> GetAllEqpt(long wingId)
        {
            return _dashboardDb.GetAllEqpt(wingId);
        }
        public List<DashOneYearCount> GetEmerMonthWiseCount(long wingId)
        {
            return _dashboardDb.GetEmerMonthWiseCount(wingId);
        }
        public List<DashOneYearCount> GetPolicyMonthWiseCount(long wingId)
        {
            return _dashboardDb.GetPolicyMonthWiseCount(wingId);
        }

    }
}
