﻿using EHL.Api.Helpers;
using EHL.Business.Interfaces;
using EHL.Common.Models;
using InSync.Api.Helpers;
using Microsoft.AspNetCore.Mvc;
using static EHL.Common.Enum.Enum;

namespace EHL.Api.Controllers
{
	[Route("api/[controller]")]
	public class PolicyController : ControllerBase
	{
		private readonly IPolicyManger _policyManger;
		public PolicyController(IPolicyManger policyManger)
		{
			_policyManger = policyManger;
		}

		[Authorization(RoleType.Admin)]
		[HttpPost]
		public async Task<IActionResult> AddPolicy([FromForm] Policy policy)
		{
			policy.CreatedBy = HttpContext.GetUserId();
			policy.CreatedOn = DateTime.Now;
			policy.IsActive = true;
			policy.IsDeleted = false;
			if (policy.PolicyFile != null && policy.PolicyFile.Length > 0)
			{
				using (var memoryStream = new MemoryStream())
				{
					await policy.PolicyFile.CopyToAsync(memoryStream);
					policy.FileBytes = memoryStream.ToArray();  // Store file content as byte array
				}
			}
			return Ok(await _policyManger.AddPolicy(policy));
		}

		[Authorization(RoleType.Admin)]
		[HttpPost, Route("update")]
        public async Task<IActionResult> UpdatePolicy([FromForm] Policy policy)
        {
            policy.UpdatedBy = HttpContext.GetUserId();
            policy.UpdatedOn = DateTime.Now;
            policy.IsActive = true;
            policy.IsDeleted = false;
            if (policy.PolicyFile != null && policy.PolicyFile.Length > 0)
            {
                using (var memoryStream = new MemoryStream())
                {
                    await policy.PolicyFile.CopyToAsync(memoryStream);
                    policy.FileBytes = memoryStream.ToArray();  // Store file content as byte array
                }
            }
            return Ok(await _policyManger.UpdatePolicy(policy));
        }

        [HttpGet,Route("wing/{wingId}")]
		public IActionResult GetPolicyByWing(long wingId)
		{
			return Ok(_policyManger.GetAllPolicyByWing(wingId));
		}

		[HttpPost, Route("type")]
		public IActionResult GetByPolicyType([FromBody] Policy policy)
		{
			return Ok(_policyManger.GetAdvisioriesByWing(policy.WingId, policy.Type));
		}

		[HttpGet,Route("policies")]
        public IActionResult GetPoliciesAndAdvisiories()
        {
            return Ok(_policyManger.GetPoliciesAndAdvisiories());
        }
    }
}
