using EHL.Api.Authorization;
using EHL.Business.Interfaces;
using EHL.Common.Helpers;
using EHL.Common.Models;
using InSync.Api.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace EHL.Api.Controllers
{
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IUserManager _userManager;
        readonly IJwtManager _jwtManager;
        private readonly LoginAttemptService _loginAttemptService;

        public AuthController(IUserManager userManager, IJwtManager jwtManager, LoginAttemptService loginAttemptService)
        {
            _userManager = userManager;
            _jwtManager = jwtManager;
            _loginAttemptService = loginAttemptService;
        }
        [HttpPost, Route("login")]
        public IActionResult DoLogin([FromBody] Login login)
        {
            var ip = HttpContext.Connection.RemoteIpAddress?.ToString();
            if (_loginAttemptService.IsBlocked(ip))
            {
                return StatusCode(429, new
                {
                    ErrorCode = "TOO_MANY_ATTEMPTS",
                    ErrorMessage = "Too many failed login attempts. Please try again after 15 minutes."
                });
            }

            var user = _userManager.GetUserByEmail(login.UserName);
            if (user != null)
            {
                _loginAttemptService.ResetAttempts(ip);

                bool isPasswordCorrect = BCrypt.Net.BCrypt.Verify(login.Password, user.Password);
                if (isPasswordCorrect)
                {
                    var jwtToken = _jwtManager.GenerateJwtToken(user);

                    return Ok(new { token = jwtToken });
                }
                else
                {
                    return Unauthorized(new { message = "Invalid password" });
                }

            }
            else
            {
                _loginAttemptService.RecordFailedAttempt(ip);
                return Unauthorized(new { message = "Invalid username or password." });
            }
        }


       

        [HttpPost, Route("forget-password")]
        public IActionResult ForgetPassword([FromBody] Login request)
        {
            var user = _userManager.GetUserByEmail(request.UserName);
            if (user == null)
                return NotFound(new { message = "User not found" });

            _userManager.UpdatePassword(user.Id, request.Password);

            return Ok(new { message = "Password reset link sent to your email." });
        }

        [HttpGet, Route("logout")]
        public IActionResult Logout()
        {

            return Ok(new { StatusCode = 200, message = "Logged out successfully." });
        }

    }
}