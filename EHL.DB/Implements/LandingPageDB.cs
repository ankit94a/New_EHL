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
	public class LandingPageDB : BaseDB, ILandingPageDB
	{
		public LandingPageDB(IConfiguration configuration) : base(configuration) { }

		public bool AddNew(News news)
		{
			string query = string.Format(@"insert into news (text,status,createdby,createdon,isactive,isdeleted) values(@text,@status,@createdby,@createdon,@isactive,@isdeleted)");
			var result = connection.Execute(query, news);
			return result > 0;
		}

		public List<News> GetAllNews()
		{
			string query = string.Format(@"select * from news");
			var result = connection.Query<News>(query).ToList();
			return result;
		}

		public bool AddLandingProfile(LandingProfile profile)
		{
			string query = string.Format(@"insert into landingprofile (title,description,profile,createdby,createdon,isactive,isdeleted) values(@title,@description,@profile,@createdby,@createdon,@isactive,@isdeleted)");
			var result = connection.Execute(query, profile);
			return result > 0;
		}

		public LandingProfile GetProfile()
		{
			string query = @"SELECT TOP 1 * FROM landingprofile ORDER BY createdOn DESC";
			return connection.Query<LandingProfile>(query).FirstOrDefault();
		}


	}
}
