using EHL.Api.Helpers;
using EHL.Business.Interfaces;
using EHL.Common.Models;
using Microsoft.AspNetCore.Mvc;
using static EHL.Common.Enum.Enum;

namespace EHL.Api.Controllers
{
	[Route("api/[controller]")]
	public class LandingPageController : ControllerBase
	{
		private readonly ILandingPageManager _landingPageManager;
		public LandingPageController(ILandingPageManager landingPageManager)
		{
			_landingPageManager = landingPageManager;
		}
		
        [Authorization(RoleType.Admin)]
        [HttpPost, Route("deativate")]
        public IActionResult Deactivate([FromBody] DeactivateModel model)
        {
            return Ok(_landingPageManager.Deactivate(model));
        }
    }
}
