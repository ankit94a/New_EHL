//using BIS.Common.Helpers;
using EHL.Common.Helpers;
using EHL.Common.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Hosting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using static EHL.Common.Enum.Enum;
//using static BIS.Common.Enums.Enum;

namespace InSync.Api.Helpers
{
	public static class ClaimHelper
	{
		public static int GetUserId(this HttpContext httpContext)
		{
			return Convert.ToInt32(httpContext.User?.Claims?.Where(c => c.Type == EHLConstant.UserId).FirstOrDefault().Value);
		}
		public static int GetRoleId(this HttpContext httpContext)
		{
			return Convert.ToInt32(httpContext.User.Claims.Where(c => c.Type == EHLConstant.RoleId).FirstOrDefault().Value);
		}
		//public static RoleType GetRoleType(this HttpContext httpContext)
		//{
		//    return (RoleType)Enum.Parse(typeof(RoleType), httpContext.User.Claims.Where(c => c.Type == EHLConstant.RoleType).FirstOrDefault().Value);
		//}

	}
}
