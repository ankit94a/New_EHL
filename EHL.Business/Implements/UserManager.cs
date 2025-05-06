using EHL.Business.Interfaces;
using EHL.Common.Models;
using EHL.DB.Infrastructure;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EHL.Business.Implements
{
	public class UserManager : IUserManager
	{
		private readonly IUserDB _userDB;

		public UserManager(IUserDB userDB)
		{
			_userDB = userDB;
		}

		public UserDetails GetUserByEmailPassword(string userName, string password)
		{
			return _userDB.GetUserByEmailPassword(userName, password);
		}
		public List<RolePermission> GetAllRolePermission(long RoleId)
		{
			return _userDB.GetAllRolePermission(RoleId);
		}
	}
}
