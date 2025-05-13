using EHL.Business.Interfaces;
using EHL.Common.Models;
using Microsoft.AspNetCore.Mvc;
using EHL.Common.Enum;
using iText.Kernel.Pdf.Extgstate;
using System.Net.Sockets;
using System.Net;
using System;
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
			var fileNameOnly = Path.GetFileName(file.FilePath);
			var rootPath = string.Empty;

			if (file.FileType == Common.Enum.Enum.DownloadFileType.Emer)
			{
				rootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "emer");
			}
			else if (file.FileType == Common.Enum.Enum.DownloadFileType.Policy)
			{
				rootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "policy");
			}
			else if (file.FileType == Common.Enum.Enum.DownloadFileType.Index)
			{
				rootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "index");
			}
			else if (file.FileType == Common.Enum.Enum.DownloadFileType.TechnicalAoAI)
			{
				rootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "technicalAoAi");
			}

			var fullFilePath = Path.Combine(rootPath, fileNameOnly);
			file.FilePath = fullFilePath;

			if (string.IsNullOrEmpty(file.FilePath) || !System.IO.File.Exists(file.FilePath))
			{
				return NotFound("File does not exist on the server.");
			}

			var memoryStream = new MemoryStream();
			var extension = Path.GetExtension(file.FilePath);
			var mimeType = GetMimeType(extension);

			if (extension.Equals(".pdf", StringComparison.OrdinalIgnoreCase))
			{
				try
				{
					using (var pdfStream = new FileStream(file.FilePath, FileMode.Open, FileAccess.Read, FileShare.ReadWrite))
					using (var tempMemoryStream = new UnclosableMemoryStream())
					using (var reader = new iText.Kernel.Pdf.PdfReader(pdfStream))
					{
						var writerProperties = new iText.Kernel.Pdf.WriterProperties();
						using (var writer = new iText.Kernel.Pdf.PdfWriter(tempMemoryStream, writerProperties))
						using (var pdfDoc = new iText.Kernel.Pdf.PdfDocument(reader, writer))
						{
							var font = iText.Kernel.Font.PdfFontFactory.CreateFont(iText.IO.Font.Constants.StandardFonts.HELVETICA_BOLD);

							int numberOfPages = pdfDoc.GetNumberOfPages();
							var ipAddress = GetLocalIPAddress();
							string dateTime = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
							for (int i = 1; i <= numberOfPages; i++)
							{
								var page = pdfDoc.GetPage(i);
								var pageSize = page.GetPageSize();
								var canvas = new iText.Kernel.Pdf.Canvas.PdfCanvas(page);
								var gs = new PdfExtGState().SetFillOpacity(0.3f);
								canvas.SetExtGState(gs);
								float centerX = pageSize.GetWidth() / 4;
								float centerY = pageSize.GetHeight() / 3;
								float angle = 45;
								double radians = angle * (Math.PI / 180);
								float cos = (float)Math.Cos(radians);
								float sin = (float)Math.Sin(radians);
								float lineSpacing = 40;

								canvas.SetFillColor(iText.Kernel.Colors.ColorConstants.RED)
									  .BeginText()
									  .SetFontAndSize(font, 60)
									  .SetTextMatrix(cos, sin, -sin, cos, centerX, centerY + lineSpacing / 2)
									  .ShowText(ipAddress)
									  .EndText();

								canvas.BeginText().SetFontAndSize(font, 50)
										.SetTextMatrix(cos, sin, -sin, cos, centerX, centerY - (lineSpacing * 1.2f)) // move down more for top margin
										.ShowText(dateTime).EndText();
							}
							pdfDoc.Close();
						}

						tempMemoryStream.Position = 0;
						await tempMemoryStream.CopyToAsync(memoryStream);
						memoryStream.Position = 0;
					}
				}
				catch (Exception e)
				{
					return StatusCode(500, "Error processing PDF file.");
				}
			}
			else
			{
				using (var stream = new FileStream(file.FilePath, FileMode.Open, FileAccess.Read))
				{
					await stream.CopyToAsync(memoryStream);
				}
				memoryStream.Position = 0;
			}

			var downloadFileName = Path.GetFileName(file.FilePath);
			return File(memoryStream, mimeType, downloadFileName);
		}
		public class UnclosableMemoryStream : MemoryStream
		{
			public override void Close()
			{

			}

			protected override void Dispose(bool disposing)
			{

			}

			public void ReallyClose()
			{
				base.Dispose(disposing: true);
			}
		}

		public static string GetLocalIPAddress()
		{
			var host = Dns.GetHostEntry(Dns.GetHostName());
			foreach (var ip in host.AddressList)
			{
				if (ip.AddressFamily == AddressFamily.InterNetwork)
				{
					return ip.ToString(); // Return the first IPv4 address
				}
			}
			throw new Exception("No network adapters with an IPv4 address in the system!");
		}
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
