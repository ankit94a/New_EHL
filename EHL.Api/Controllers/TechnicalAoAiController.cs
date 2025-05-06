using EHL.Business.Implements;
using EHL.Business.Interfaces;
using EHL.Common.Models;
using InSync.Api.Helpers;
using Microsoft.AspNetCore.Mvc;

namespace EHL.Api.Controllers
{
    [Route("api/[controller]")]
    public class TechnicalAoAiController : ControllerBase
    {
        
        private readonly ITechnicalAoAiManager _technichalAoAiManager;
        public TechnicalAoAiController(ITechnicalAoAiManager technicalAoAiManager)
        {
            _technichalAoAiManager = technicalAoAiManager;
        }
        [HttpPost]
        public async Task<IActionResult> AddTechnicalAoAi([FromForm] TechnicalAoAi technicalAoAi)
        {
            technicalAoAi.CreatedBy = HttpContext.GetUserId();
            technicalAoAi.CreatedOn = DateTime.Now;
            technicalAoAi.IsDeleted = false;
            technicalAoAi.IsActive = true;

            if (technicalAoAi.TechnicalAoAiFile != null && technicalAoAi.TechnicalAoAiFile.Length > 0)
            {
                using (var memoryStream = new MemoryStream())
                {
                    await technicalAoAi.TechnicalAoAiFile.CopyToAsync(memoryStream); // Use `await` for async file copying
                    technicalAoAi.FileBytes = memoryStream.ToArray();  // Store file content as byte array
                }
            }
            var result = await _technichalAoAiManager.AddTechnicalAoAi(technicalAoAi); // Ensure `AddEmerAsync` is an async method

            return Ok(result);
        }

        [HttpGet]
       
        public IActionResult GetList()
        {

            return Ok(_technichalAoAiManager.GetList());
        }

        [HttpPost, Route("update")]
        public async Task<IActionResult> UpdateTechnicalAoAi([FromForm] TechnicalAoAi technicalAoAi)
        {
            technicalAoAi.UpdatedBy = HttpContext.GetUserId();
            technicalAoAi.UpdatedOn = DateTime.Now;
            technicalAoAi.IsActive = true;
            technicalAoAi.IsDeleted = false;
            return Ok(await _technichalAoAiManager.UpdateTechnicalAoAi(technicalAoAi));
        }

    }
}
