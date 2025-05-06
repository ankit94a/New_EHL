import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { DownloadModel } from '../models/download.model';

@Injectable({
  providedIn: 'root'
})
export class DownloadService {

  constructor(private apiService: ApiService) { }

  download(downloadModel: DownloadModel) {

    if (!downloadModel || !downloadModel.filePath) {
      console.error("Invalid download model or missing file path.");
      return;
    }

    this.apiService.postWithHeaderToDownload('file/download', downloadModel).subscribe((res: Blob) => {
      if (!res || res.size === 0) {
        console.error("Downloaded file is empty.");
        return;
      }

      const blob = new Blob([res], { type: res.type });
      const url = window.URL.createObjectURL(blob);
      const linkElement = document.createElement('a');
      linkElement.href = url;

      // Determine the file name
      let fileName = downloadModel.name || "downloaded_file.pdf"; // Use provided name or default

      linkElement.download = fileName;
      document.body.appendChild(linkElement);
      linkElement.click();

      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(linkElement);
    }, error => {
      console.error("Error downloading file:", error);
    });
  }
}
