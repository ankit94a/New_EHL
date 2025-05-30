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
	public class LandingPageDB : BaseDB, ILandingPageDB
	{
		public LandingPageDB(IConfiguration configuration) : base(configuration) { }

		public bool AddNew(News news)
		{
			try
			{
				string query = string.Format(@"insert into news (text,status,createdby,createdon,isactive,isdeleted) values(@text,@status,@createdby,@createdon,@isactive,@isdeleted)");
				var result = connection.Execute(query, news);
				return result > 0;
			}
			catch(Exception ex)
			{
				EHLLogger.Error(ex, "Class=LandingPageDB,method=AddNew");
				throw;
			}
			
		}

		public List<News> GetAllNews()
		{
			try
			{
				string query = string.Format(@"select * from news");
				var result = connection.Query<News>(query).ToList();
				return result;
			}
			catch (Exception ex)
			{
				EHLLogger.Error(ex, "Class=LandingPageDB,method=GetAllNews");
				throw;
			}
			
		}

		public bool AddLandingProfile(LandingProfile profile)
		{
			try
			{
				string query = string.Format(@"insert into landingprofile (title,description,profile,createdby,createdon,isactive,isdeleted) values(@title,@description,@profile,@createdby,@createdon,@isactive,@isdeleted)");
				var result = connection.Execute(query, profile);
				return result > 0;
			}
			catch (Exception ex)
			{
				EHLLogger.Error(ex, "Class=LandingPageDB,method=AddLandingProfile");
				throw;
			}
		
		}

		public LandingProfile GetProfile()
		{
			try
			{
				string query = @"SELECT TOP 1 * FROM landingprofile ORDER BY createdOn DESC";
				return connection.Query<LandingProfile>(query).FirstOrDefault();
			}
			catch (Exception ex)
			{
				EHLLogger.Error(ex, "Class=LandingPageDB,method=GetProfile");
				throw;
			}
			
		}
        public bool Deactivate(DeactivateModel model)
        {
            try
            {
                string query = $"UPDATE {model.TableName} SET isactive = 0 WHERE id = @Id";
                var result = connection.Execute(query, new { model.Id });
                return result > 0;
            }
            catch (Exception ex)
            {
                EHLLogger.Error(ex, $"Deactivate method error for table = {model.TableName}, method is in LandingPageDB.Deactivate");
                throw;
            }
        }

    }
}
