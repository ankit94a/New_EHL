using EHL.Common.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EHL.DB.Interfaces
{
	public interface IPolicyDB
	{
		public bool AddPolicy(Policy policy);
        public bool UpdatePolicy(Policy policy);
        public List<Policy> GetAllPolicyByWing(long wingId);
		public List<Policy> GetAdvisioriesByWing(long wingId, string type);
	}
}
