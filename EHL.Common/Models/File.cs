using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EHL.Common.Models
{
	public class AttachedFile : Base
	{
		public IFormFile EmerFile { get; set; }
		public long FileId { get; set; }
		public byte[] Document { get; set; }
		public string Name { get; set; }
		public long Size { get; set; }
		public string FileType { get; set; }
		public string FilePath { get; set; }
	}

}
