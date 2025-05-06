using Dapper;
using EHL.Common.Models;
using EHL.DB.Infrastructure;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EHL.DB.Implements
{
	public class UserDB : BaseDB, IUserDB
	{
		public UserDB(IConfiguration configuration) : base(configuration)
		{
		}

		public UserDetails GetUserByEmailPassword(string userName, string password)
		{
			try
			{
				string query = string.Format("select * from userdetails where username=@username and password = @pass");
				var result = connection.Query<UserDetails>(query, new { username = userName, pass = password }).FirstOrDefault();
				return result;
			}
			catch (Exception ex)
			{
				//BISLogger.Error(ex, "User Loggin error in method GetUserByEmailPassword");
				throw;
			}
		}
		public List<RolePermission> GetAllRolePermission(long RoleId)
		{
			try
			{
				string query = string.Format(@"Select * from rolepermission  where  roleid=@roleid");
				var result = connection.Query<RolePermission>(query, new { roleid = RoleId }).ToList();
				return result;
			}
			catch (Exception ee)
			{
				throw;
			}
		}
	}
}
