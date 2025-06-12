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
