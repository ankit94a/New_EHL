using EHL.Business.Interfaces;
using EHL.Common.Models;
using EHL.DB.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EHL.Business.Implements
{
	public class FileManager : IFileManager
	{
		private readonly IFileDB _fileDB;
		public FileManager(IFileDB fileDB)
		{
			_fileDB = fileDB;
		}
		public async Task<AttachedFile> GetDoucmentById(long Id, string downloadType)
		{
			return await _fileDB.GetDocumentById(Id, downloadType);
		}
	}
}
