using EHL.Business.Interfaces;
using EHL.Common.Models;
using Microsoft.AspNetCore.Mvc;
using EHL.Common.Enum;
using iText.Kernel.Pdf.Extgstate;
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
							// Create a bold font (Helvetica-Bold)
							var font = iText.Kernel.Font.PdfFontFactory.CreateFont(
								iText.IO.Font.Constants.StandardFonts.HELVETICA_BOLD);

							int numberOfPages = pdfDoc.GetNumberOfPages();

							for (int i = 1; i <= numberOfPages; i++)
							{
								var page = pdfDoc.GetPage(i);
								var pageSize = page.GetPageSize();

								// Create canvas for watermark
								var canvas = new iText.Kernel.Pdf.Canvas.PdfCanvas(page);
								var gs = new PdfExtGState().SetFillOpacity(0.3f);
								canvas.SetExtGState(gs);
								canvas.SetFillColor(iText.Kernel.Colors.ColorConstants.RED)
									.BeginText()
									.SetFontAndSize(font, 60)
									.SetTextMatrix(100, page.GetPageSize().GetHeight() / 2)
									.ShowText("CONFIDENTIAL")
									.EndText();
							}

							pdfDoc.Close();
						}

						// Copy the temporary stream to our main stream
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
				// For non-PDF, just copy the file as-is
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
				// Do nothing - prevent closing
			}

			protected override void Dispose(bool disposing)
			{
				// Do nothing - prevent disposing
			}

			public void ReallyClose()
			{
				base.Dispose(disposing: true);
			}
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
