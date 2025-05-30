using Dapper;
using EHL.Common.Helpers;
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
				EHLLogger.Error(ex, "Class=UserDB,method=GetUserByEmailPassword");
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
				EHLLogger.Error(ee, "Class=UserDB,method=GetAllRolePermission");
				throw;
			}
		}
        public UserDetails GetUserByEmail(string userName)
        {
            try
            {
                string query = string.Format("select * from userdetails where username=@username");
                var result = connection.Query<UserDetails>(query, new { username = userName }).FirstOrDefault();
                return result;
            }
            catch (Exception ex)
            {
                EHLLogger.Error(ex, "Class=UserDB,method=GetUserByEmail");
                throw;
            }
        }
        public bool UpdatePassword(long Id, string Password)
        {
            try
            {
                string query = string.Format("update userdetails set password=@password where id=@id");
                var result = connection.Query<UserDetails>(query, new { password = Password, id = Id }).FirstOrDefault();
                return true;
            }
            catch (Exception ex)
            {
                EHLLogger.Error(ex, "Class=UserDB,method=UpdatePassword");
                throw;
            }
        }
    }
}
