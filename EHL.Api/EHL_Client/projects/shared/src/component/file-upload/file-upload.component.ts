import { Component, EventEmitter, Output } from '@angular/core';
import { SharedLibraryModule } from '../../shared-library.module';

@Component({
  selector: 'lib-file-upload',
  standalone: true,
  imports: [SharedLibraryModule],
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css'] // Fixed typo: styleUrl → styleUrls
})
export class FileUploadComponent {

  @Output() fileNameChange = new EventEmitter<string | null>();
  @Output() fileSizeFormattedChange = new EventEmitter<string | null>();
  @Output() alertMessageChange = new EventEmitter<string | null>();
  @Output() fileSelected = new EventEmitter<File | null>(); // Emits file to parent

  fileName: string | null = null;
  fileSizeFormatted: string | null = null;
  alertMessage: string | null = null;

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      const file = input.files[0];
      const allowedTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      ];

      if (allowedTypes.includes(file.type)) {
        this.fileName = file.name;
        this.fileSizeFormatted = this.getReadableFileSize(file.size);
        this.alertMessage = null;

        this.fileNameChange.emit(this.fileName);
        this.fileSizeFormattedChange.emit(this.fileSizeFormatted);
        this.alertMessageChange.emit(null);
        this.fileSelected.emit(file);
      } else {
        this.fileName = null;
        this.fileSizeFormatted = null;
        this.alertMessage = 'Invalid file type! Only PDF, Word, and Excel files are allowed.';

        this.fileNameChange.emit(null);
        this.fileSizeFormattedChange.emit(null);
        this.alertMessageChange.emit(this.alertMessage);
        this.fileSelected.emit(null);
      }
    }
  }

  removeFile(): void {
    this.fileName = null;
    this.fileSizeFormatted = null;
    this.alertMessage = null;

    this.fileNameChange.emit(null);
    this.fileSizeFormattedChange.emit(null);
    this.alertMessageChange.emit(null);
    this.fileSelected.emit(null);

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
}
