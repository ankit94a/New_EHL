using EHL.Business.Interfaces;
using EHL.Common.Models;
using Microsoft.AspNetCore.Mvc;

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
		[HttpPost, Route("news")]
		public IActionResult AddNews([FromBody] News news)
		{
			return Ok(_landingPageManager.AddNew(news));
		}
		[HttpGet, Route("news")]
		public IActionResult GetAllNews()
		{
			return Ok(_landingPageManager.GetAllNews());
		}
		[HttpGet, Route("profile")]
		public IActionResult GetProfile()
		{
			return Ok(_landingPageManager.GetProfile());
		}
		[HttpPost, Route("profile")]
		public IActionResult AddProfile([FromBody] LandingProfile profile)
		{
			return Ok(_landingPageManager.AddLandingProfile(profile));	
		}
	}
}
