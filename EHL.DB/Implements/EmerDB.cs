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
	public class EmerDB : BaseDB, IEmerDB
	{
		public EmerDB(IConfiguration configuration) : base(configuration)
		{

		}

		public List<EmerModel> GetAllEmer(long wingId)
		{
			try
			{
				string query = string.Format(@"select * from emer  where wingid = @wingid and isactive = 1");
				var result = connection.Query<EmerModel>(query, new { wingid = wingId }).ToList();
				return result;
			}
			catch (Exception ex)
			{
				throw ex;
			}

		}
		public List<EmerModel> GetAllMasterSheet()
		{
			try
			{
				string query = string.Format(@"select * from mastersheet  where isactive = 1");
				var result = connection.Query<EmerModel>(query).ToList();
				return result;
			}
			catch (Exception ex)
			{
				throw ex;
			}

		}
		public List<EmerModel> GetLatestEmer()
		{
			try
			{
				string query = string.Format(@"select * from emer where isactive=1 order by id desc OFFSET 10 ROWS FETCH NEXT 10 ROWS ONLY;");
				var result = connection.Query<EmerModel>(query).ToList();
				return result;
			}
			catch (Exception ex)
			{
				throw ex;
			}

		}
		public List<Policy> GetLatestTwoPoliciesPerType()
		{
			try
			{
				string query = @"
			WITH ranked_policies AS (
				SELECT *, 
					   ROW_NUMBER() OVER (PARTITION BY type ORDER BY id DESC) AS rn
				FROM policy
				WHERE type IN ('Technical Manuals', 'Policy Compendium', 'Advisories', 'ISPL', 'Misc','EP Contract')
				AND isactive = 1
			)
			SELECT * 
			FROM ranked_policies
			WHERE rn <= 2
			ORDER BY type, id DESC;
		";

				var result = connection.Query<Policy>(query).ToList();
				return result;
			}
			catch (Exception ex)
			{
				throw;
			}
		}

		public List<EmerIndex> GetEmerIndex(int wingId)
		{
			try
			{
				string query = string.Format(@"select * from emerindex where isactive=1 and wingid=@wingid;");
				var result = connection.Query<EmerIndex>(query, new { wingid = wingId }).ToList();
				return result;
			}
			catch (Exception ex)
			{
				throw ex;
			}

		}
		public bool AddEmer(EmerModel emer)
		{
			try
			{
				// Ensure that CreatedOn and UpdatedOn are DateTime values before the insert
				if (emer.CreatedOn == default)
					emer.CreatedOn = DateTime.Now;


				string query = @"insert into emer 
                            (emernumber, subject, subfunction, category, subcategory, categoryid, subcategoryid, eqpt, remarks, fileid, createdby, createdon, isactive,wing,wingid,subfunctioncategory,subfunctiontype,filename,filepath)
                          values 
                            (@emernumber, @subject, @subfunction, @category, @subcategory, @categoryid, @subcategoryid, @eqpt, @remarks, @fileid, @createdby, @createdon, @isactive,@wing,@wingid,@subfunctioncategory,@subfunctiontype,@filename,@filepath)";

				var result = connection.Execute(query, emer);
				return result > 0;
			}
			catch (Exception ex)
			{
				// Handle exception (Log it)
				throw ex;
			}
		}

        public bool AddEmerIndex(EmerIndex emer)
        {
            try
            {
                // Ensure that CreatedOn and UpdatedOn are DateTime values before the insert
                if (emer.CreatedOn == default)
                    emer.CreatedOn = DateTime.Now;


                string query = @"insert into emerindex 
                            (emernumber, subject,  category, categoryid,  createdby, createdon, isactive,wing,wingid,filename,filepath)
                          values 
                            (@emernumber, @subject, @category, @categoryid,  @createdby, @createdon, @isactive,@wing,@wingid,@filename,@filepath)";

                var result = connection.Execute(query, emer);
                return result > 0;
            }
            catch (Exception ex)
            {
                // Handle exception (Log it)
                throw ex;
            }
        }

        public async Task<bool> UpdateEmerIndex(EmerIndex emer)
        {
            try
            {
               string query = @"UPDATE emerIndex SET
                         emernumber = @EmerNumber,
                         subject = @Subject,
                         category = @Category,
                         categoryid = @CategoryId,
                      filename = @FileName,
                      filepath=@FilePath
                      WHERE id = @Id";

                var result = await connection.ExecuteAsync(query, emer);
                return result > 0;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public bool DeactiveEmerIndex(long Id)
        {
            try
            {
                string query = @"UPDATE emerindex SET isactive = 0 WHERE id = @Id";

                // ✅ Pass the parameter here
                var result = connection.Execute(query, new { Id });

                return result > 0;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public bool DeactivateEmer(long Id)
        {
            try
            {
                string query = @"UPDATE emer SET isactive = 0 WHERE id = @Id";

                // ✅ Pass the parameter here
                var result = connection.Execute(query, new { Id });

                return result > 0;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        //      public bool UpdateEmer(EmerModel emer)
        //{
        //	try
        //	{
        //		string query = string.Format(@"update emer set emernumber=@emerNumber,subject=@subject,subfunction=@subFunction,category=@category,subcategory=@subCategory,eqpt=@eqpt,fileid=@fileId,updatedby=@updatedBy,updatedon=@updatedOn,isactive=@isActive where id = @id");
        //		var result = connection.Execute(query,new { emernumber=emer.EmerNumber, subject=emer.Subject, subfunction=emer.SubFunction, category=emer.Category,
        //                  id = emer.Id,
        //                  eqpt = emer.Eqpt,
        //                  subcategory =emer.SubCategory,
        //			//metainfo=emer.MetaInfo,
        //			fileid = emer.FileId,
        //			updatedby = emer.UpdatedBy,
        //			updatedon = emer.UpdatedOn,
        //			isactive = emer.IsActive
        //		});
        //		return result > 0;
        //	}
        //	catch (Exception ex)
        //	{
        //		throw ex;
        //	}
        //}

        public async Task<bool> UpdateEmer(EmerModel emer)
        {
            try
            {
                string query = @"UPDATE emer SET
                         emernumber = @EmerNumber,
                         subject = @Subject,
                         subfunction = @SubFunction,
                         wing = @Wing,
                         wingid = @WingId,
                         category = @Category,
                         categoryid = @CategoryId,
                         subcategory = @SubCategory,
                         subcategoryid = @SubCategoryId,
                         eqpt = @Eqpt,
				remarks = @Remarks,
                         updatedby = @UpdatedBy,
                         updatedon = @UpdatedOn,
                         subfunctioncategory = @SubFunctionCategory,
                         subfunctiontype = @SubFunctionType,filename = @FileName,filepath=@FilePath
                      WHERE id = @Id";

                var result = await connection.ExecuteAsync(query, emer);
                return result > 0;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public long AddFile(Documents document)
		{
			try
			{
				// Ensure that the Document (byte array) is being passed correctly
				if (document.Document == null || document.Document.Length == 0)
				{
					throw new ArgumentException("Document content cannot be empty.");
				}

				string query = @"
            INSERT INTO documents (document, filetype, name, size, createdby, updatedby, createdon, isactive, isdeleted)
            VALUES (@document, @filetype, @name, @size, @createdby, @updatedby, @createdon, @isactive, @isdeleted);
            SELECT CAST(SCOPE_IDENTITY() AS BIGINT);";

				// Use Dapper to execute the query and insert the file data into the database
				var parameters = new
				{
					document.Document,        // Store the file content as VARBINARY
					document.FileType,        // File extension (e.g., pdf, docx)
					document.Name,            // File name
					document.Size,            // File size in bytes
					document.CreatedBy,       // Created by user
					document.UpdatedBy,       // Updated by user
					CreatedOn = DateTime.Now, // Created on timestamp
					IsActive = true,          // Active flag
					IsDeleted = false         // Deleted flag
				};

				// Execute the query and get the inserted ID
				var id = connection.ExecuteScalar<long>(query, parameters);

				return id;
			}
			catch (Exception ex)
			{
				throw new Exception("An error occurred while inserting the document.", ex);
			}
		}


	}
}
