using EHL.Api.Authorization;
using EHL.Business.Interfaces;
using EHL.Common.Models;
using InSync.Api.Helpers;
using Microsoft.AspNetCore.Mvc;

namespace EHL.Api.Controllers
{
	[Route("api/[controller]")]
	public class AuthController : ControllerBase
	{
		private readonly IUserManager _userManager;
		readonly IJwtManager _jwtManager;
		private IHttpContextAccessor _httpContextAccessor;
		public AuthController(IUserManager userManager, IJwtManager jwtManager, IHttpContextAccessor httpContextAccessor)
		{
			_userManager = userManager;
			_jwtManager = jwtManager;
			_httpContextAccessor = httpContextAccessor;
		}

		[HttpPost, Route("login")]
		public bool DoLogin([FromBody] Login login)
		{
			IActionResult response = Unauthorized();
			var user = _userManager.GetUserByEmailPassword(login.UserName, login.Password);
			if (user != null)
			{
				var jwtToken = _jwtManager.GenerateJwtToken(user);
				var sessUser = new SessionManager(_httpContextAccessor)
				{
					UserId = user.Id,
					UserName = user.Name,
					RoleId = user.RoleId.ToString(),
					RoleType = user.RoleType.ToString(),
					Access_Token = jwtToken
				};
				var _ = _httpContextAccessor.HttpContext.Session.Id;
				return true;
			}
			return false;
		}

		[HttpGet, Route("rolepermission")]
		public IActionResult GetRolePermission()
		{
			var roleId = HttpContext.GetRoleId();
			return Ok(_userManager.GetAllRolePermission(roleId));
		}
		[HttpGet, Route("role/type")]
		public IActionResult GetRole()
		{
			var sessUser = new SessionManager(_httpContextAccessor);
			var roleType = sessUser.RoleType;
			return Ok(roleType);
		}

		[HttpGet, Route("logout")]
		public IActionResult UserLogout()
		{
			var sessUser = new SessionManager(_httpContextAccessor);
			var result = sessUser.Logout();
			return Ok(new { message = result });
		}

	}
}
