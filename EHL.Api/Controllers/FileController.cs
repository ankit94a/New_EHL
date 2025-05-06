using EHL.Business.Interfaces;
using EHL.Common.Models;
using Microsoft.AspNetCore.Mvc;
using EHL.Common.Enum;
namespace EHL.Api.Controllers
{
	[Route("api/[controller]")]
	public class FileController : Controller
	{
		private readonly IFileManager _fileManager;
		public FileController(IFileManager fileManager)
		{
			_fileManager = fileManager;
		}

		[HttpPost, Route("download")]
		public async Task<IActionResult> DownloadFile([FromBody] AttachedFile file)
		{
			var dabs = Path.GetFileName(file.FilePath);
			var rootPath = String.Empty;
			if (file.FileType == Common.Enum.Enum.DownloadFileType.Emer)
			{
				rootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "emer");
			}
			else if (file.FileType == Common.Enum.Enum.DownloadFileType.Policy)
			{
				rootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "policy");
			}

			var fullFilePath = Path.Combine(rootPath, dabs);
			file.FilePath = fullFilePath;
			if (file.FilePath == null || string.IsNullOrEmpty(file.FilePath))
			{
				return NotFound("File not found.");
			}

			// Stored file path
			if (!System.IO.File.Exists(file.FilePath))
			{
				return NotFound("File does not exist on the server.");
			}

			var fileType = GetMimeType(Path.GetExtension(file.FilePath)); // Get MIME type

			var memoryStream = new MemoryStream();
			using (var stream = new FileStream(file.FilePath, FileMode.Open, FileAccess.Read))
			{
				await stream.CopyToAsync(memoryStream);
			}

			memoryStream.Position = 0;
			var fileName = Path.GetFileName(file.FilePath);

			return File(memoryStream, fileType, fileName);
		}

		// Helper function to determine the MIME type
		private string GetMimeType(string extension)
		{
			var mimeTypes = new Dictionary<string, string>
			{
				{ ".pdf", "application/pdf" },
				{ ".doc", "application/msword" },
				{ ".docx", "application/vnd.openxmlformats-officedocument.wordprocessingml.document" },
				{ ".xls", "application/vnd.ms-excel" },
				{ ".xlsx", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" },
				{ ".png", "image/png" },
				{ ".jpg", "image/jpeg" },
				{ ".jpeg", "image/jpeg" },
				{ ".txt", "text/plain" },
				{ ".csv", "text/csv" }
			};
			return mimeTypes.ContainsKey(extension) ? mimeTypes[extension] : "application/octet-stream";
		}

	}
}
