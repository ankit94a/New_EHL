using Dapper;
using EHL.Common.Models;
using EHL.DB.Interfaces;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EHL.DB.Implements
{
	public class PolicyDB : BaseDB, IPolicyDB
	{
		public PolicyDB(IConfiguration configuration) : base(configuration)
		{

		}

		public List<Policy> GetAllPolicyByWing(long wingId)
		{
			string query = string.Format(@"select * from policy where wingid = @wingid and isactive = 1");
			return connection.Query<Policy>(query, new { wingid = wingId }).ToList();
		}

		public bool AddPolicy(Policy policy)
		{
            policy.FileName = policy.PolicyFile.FileName;
            string query = string.Format(@"insert into policy (type,wingid,categoryid,wing,category,subcategory,subcategoryid,eqpt,filename,remarks,filepath) values (@type,@wingid,@categoryid,@wing,@category,@subcategory,@subcategoryid,@eqpt,@fileName,@remarks,@filepath)");
			return connection.Execute(query, policy) > 0;
		}
        public bool UpdatePolicy(Policy policy)
        {
            if (policy.PolicyFile != null)
            {
                policy.FileName = policy.PolicyFile.FileName;
            }
			string query = @"UPDATE policy SET type = @Type,wingid = @WingId,categoryid = @CategoryId,wing = @Wing,subcategory = @subcategory,subcategoryid = @subcategoryid,updatedby=@updatedby,updatedon=@updatedon,
						eqpt = @eqpt,category = @Category,filename = @FileName,remarks = @Remarks,filepath = @FilePath WHERE id = @Id"; 
			return connection.Execute(query, policy) > 0;

        }
        public List<Policy> GetAdvisioriesByWing(long wingId, string Type)
		{
			string query = string.Format(@"select * from policy where wingid = @wingid and type=@type and isactive = 1");
			return connection.Query<Policy>(query, new { wingid = wingId,type=Type }).ToList();
		}
	}
}
