//using BIS.Common.Entities;
//using BIS.Common.Entities;
//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Threading.Tasks;
using EHL.Common.Models;
namespace EHL.Api.Authorization
{
	public interface IJwtManager
	{
		string GenerateJwtToken(UserDetails user);
	}
}
