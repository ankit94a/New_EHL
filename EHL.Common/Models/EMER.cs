using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using static EHL.Common.Enum.Enum;
namespace EHL.Common.Models
{
	public class EmerModel : Base
	{
		public string EmerNumber { get; set; }
		public string Subject { get; set; }
		public string SubFunction { get; set; }
		public string SubFunctionCategory { get; set; }
		public string SubFunctionType { get; set; }
		public long CategoryId { get; set; }
		public long SubCategoryId { get; set; }
		public string Category { get; set; }
		public string SubCategory { get; set; }
		public string Eqpt { get; set; }
		public IFormFile EmerFile { get; set; }
		public string Remarks { get; set; }
		public long FileId { get; set; }
		public byte[] FileBytes { get; set; }

		// Additional properties to store file details
		public string FileName { get; set; }
		public string FilePath { get; set; }
		public long FileSize { get; set; }
		public string Wing { get; set; }
		public int WingId { get; set; }
		//public string FileType { get; set; }
	}

	public class Documents
	{
		public long Id { get; set; }               // Primary Key
		public byte[] Document { get; set; }       // File content as a byte array (VARBINARY)
		public string Name { get; set; }           // Name of the file
		public string FileType { get; set; }       // File type/extension (e.g., pdf, docx)
		public long Size { get; set; }             // Size of the file (in bytes)
		public int CreatedBy { get; set; }      // User who created the record
		public int UpdatedBy { get; set; }      // User who last updated the record
		public DateTime CreatedOn { get; set; }    // Creation timestamp
		public DateTime UpdatedOn { get; set; }    // Update timestamp
		public bool IsActive { get; set; }         // Active flag (true/false)
		public bool IsDeleted { get; set; }        // Soft delete flag (true/false)
		public string FilePath { get; set; }
	}

    public class EmerIndex : Base
    {
        public string EmerNumber { get; set; }
        public string Category { get; set; }
        public string Wing { get; set; }
        public int WingId { get; set; }
        public int CategoryId { get; set; }
        public string Subject { get; set; }
        public string FileName { get; set; }
        public string FilePath { get; set; }
        public IFormFile EmerFile { get; set; }
        public byte[] FileBytes { get; set; }
    }

}