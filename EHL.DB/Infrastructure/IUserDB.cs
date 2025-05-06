using EHL.Common.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EHL.DB.Infrastructure
{
	public interface IUserDB
	{
		public UserDetails GetUserByEmailPassword(string userName, string password);
		public List<RolePermission> GetAllRolePermission(long RoleId);
	}
}
