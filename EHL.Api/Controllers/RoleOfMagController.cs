using EHL.Business.Interfaces;
using EHL.Common.Models;
using Microsoft.AspNetCore.Mvc;

namespace EHL.Api.Controllers
{
    [Route("api/[controller]")]
    public class RoleOfMagController : ControllerBase
    {
        private readonly IRoleOfMagManager _roleOfMagManager;
        public RoleOfMagController(IRoleOfMagManager roleOfMagManager)
        {
            _roleOfMagManager = roleOfMagManager;
        }

        [HttpGet]
        public IActionResult GetList()
        {
            var list = _roleOfMagManager.GetList();
            return Ok(list);
        }

        [HttpPost]
        public IActionResult AddRoleOfMag([FromBody] RoleOfMag roleOfMag)
        {
            if(roleOfMag.Id > 0)
            {
                return Ok(_roleOfMagManager.UpdateRoleOfMag(roleOfMag));
            }
            if (roleOfMag == null)
            {
                return BadRequest("Role of Mag cannot be null");
            }
            return Ok(_roleOfMagManager.AddRoleOfMag(roleOfMag));
        }

    }
}
