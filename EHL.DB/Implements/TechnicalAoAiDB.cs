using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dapper;
using EHL.Common.Models;
using EHL.DB.Interfaces;
using Microsoft.Extensions.Configuration;

namespace EHL.DB.Implements
{
    public class TechnicalAoAiDB :BaseDB, ItechnicalAoAiDB
    {
        public TechnicalAoAiDB(IConfiguration configuration) : base(configuration)
        {

        }
        public List<TechnicalAoAi> GetList()
        {
            string query = string.Format("select * from technicalaoai where isactive = 1");
            return connection.Query<TechnicalAoAi>(query).ToList();
        }

        public bool AddTechnicalAoAi(TechnicalAoAi technicalAoAi)
        {
       
            // Ensure that CreatedOn and UpdatedOn are DateTime values before the insert
            if (technicalAoAi.CreatedOn == default)
                technicalAoAi.CreatedOn = DateTime.Now;


            string query = string.Format(@"insert into TechnicalAoAi (subject,reference,type,createdby,updatedby,createdon,updatedon,isactive,isDeleted,filename,filepath) values(@subject,@reference,@type,@createdby,@updatedby,@createdon,@updatedby,@isactive,@isDeleted,@filename,@filepath)");
            var result = connection.Execute(query, technicalAoAi);
            return result > 0;
        }


        public async Task<bool> UpdateTechnicalAoAi(TechnicalAoAi technicalAoAi)
        {
            try
            {
               string query = @"UPDATE TechnicalAoAi SET
                         subject = @Subject,
                         reference = @Reference,
                         type = @Type,
                         updatedby = @UpdatedBy,
                         updatedon = @UpdatedOn,
                         filename = @FileName,
                         filepath=@FilePath
                      WHERE id = @Id";

                var result = await connection.ExecuteAsync(query, technicalAoAi);
                return result > 0;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}
