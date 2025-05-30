using EHL.Business.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace EHL.Api.Controllers
{
    [Route("api/[controller]")]
    public class DashboardController : Controller
    {
        private readonly IDashboardManager _dashboardManager;

        public DashboardController(IDashboardManager daashboardManager)
        {
            _dashboardManager = daashboardManager;
        }
        [HttpGet, Route("emerCount/{wingId}")]
        public IActionResult GetAllEmerCount(long wingId)
        {
            return Ok(_dashboardManager.GetAllEmerCount(wingId));
        }
        [HttpGet, Route("dashCategory/{wingId}")]
        public IActionResult GetAllCategory(long wingId)
        {
            return Ok(_dashboardManager.GetAllCategory(wingId));
        }
        [HttpGet, Route("dashSubCategory/{wingId}")]
        public IActionResult GetAllSubCategory(long wingId)
        {
            return Ok(_dashboardManager.GetAllSubCategory(wingId));
        }
        [HttpGet, Route("dashEqpt/{wingId}")]
        public IActionResult GetAllEqpt(long wingId)
        {
            return Ok(_dashboardManager.GetAllEqpt(wingId));
        }
        [HttpGet, Route("dashOneYearEmer/{wingId}")]
        public IActionResult GetEmerMonthWiseCount(long wingId)
        {
            return Ok(_dashboardManager.GetEmerMonthWiseCount(wingId));
        }
        [HttpGet, Route("dashOneYearPolicy/{wingId}")]
        public IActionResult GetPolicyMonthWiseCount(long wingId)
        {
            return Ok(_dashboardManager.GetPolicyMonthWiseCount(wingId));
        }


    }
}
