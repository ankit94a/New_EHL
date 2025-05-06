using Dapper;
using EHL.Common.Models;
using EHL.DB.Interfaces;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Metadata;
using System.Text;
using System.Threading.Tasks;

namespace EHL.DB.Implements
{
	public class FileDB : BaseDB, IFileDB
	{
		public FileDB(IConfiguration configuration) : base(configuration)
		{

		}

		public async Task<AttachedFile> GetDocumentById(long Id, string downloadType)
		{
			string query = "SELECT * FROM documents WHERE id = @id";

			var result = await connection.QueryFirstOrDefaultAsync<AttachedFile>(query, new { id = Id });

			return result;
		}

	}
}
