import { Component } from '@angular/core';
import { SharedLibraryModule } from 'projects/shared/src/shared-library.module';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [SharedLibraryModule],
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.scss'
})
export class FileUploadComponent {
  fileName: string | null = null;
  fileSizeFormatted: string | null = null;
  alertMessage = '';
  fileType;
  constructor(){

  }

  removeFile(): void {
    this.fileName = null;
    this.fileSizeFormatted = null;
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }
  getReadableFileSize(size: number): string {
    if (size < 1024) return `${size} bytes`;
    else if (size < 1048576) return `${(size / 1024).toFixed(2)} KB`;
    else return `${(size / 1048576).toFixed(2)} MB`;
  }
  save(){

  }
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      const file = input.files[0];
      const allowedTypes = ['application/pdf',];
      if (allowedTypes.includes(file.type)) {
        this.fileName = file.name;
        this.fileSizeFormatted = this.getReadableFileSize(file.size);
        this.alertMessage = '';
      } else {
        this.fileName = null;
        this.fileSizeFormatted = null;
        this.alertMessage = 'Invalid file type! Only PDF files are allowed.'

      }
    }
  }
}
