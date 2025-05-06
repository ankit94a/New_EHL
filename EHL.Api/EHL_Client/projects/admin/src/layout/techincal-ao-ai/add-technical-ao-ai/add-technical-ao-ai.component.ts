import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'projects/shared/src/service/api.service';
import { TechnicalAoAi } from 'projects/shared/src/models/technicalAoAi.model';
import { SharedLibraryModule } from 'projects/shared/src/shared-library.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'projects/shared/src/service/auth.service';

@Component({
  selector: 'app-add-technical-ao-ai',
  standalone: true,
  imports: [SharedLibraryModule],
  templateUrl: './add-technical-ao-ai.component.html',
  styleUrl: './add-technical-ao-ai.component.scss',
})
export class AddTechnicalAoAiComponent {
  TechnicalAoAi: FormGroup;
  fileName: string | null = null;
  fileSizeFormatted: string | null = null;
  apiUrl: string | '';
  constructor(
    private authService: AuthService,
    @Inject(MAT_DIALOG_DATA) data,
    private dialogRef: MatDialogRef<AddTechnicalAoAiComponent>,
    private apiService: ApiService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {
    if (data != null) {
      this.apiUrl = 'TechnicalAoAi/update';
      this.bindDataToForm(data);
    } else {
      this.apiUrl = 'TechnicalAoAi';
      this.createForm();
    }
  }
  bindDataToForm(TechnicalAoAiData) {
    // debugger
    this.TechnicalAoAi = this.fb.group({
      id: [TechnicalAoAiData.id],
      type: [TechnicalAoAiData.type, [Validators.required]],
      subject: [TechnicalAoAiData.subject],
      reference: [TechnicalAoAiData.reference],
      TechnicalAoAiFile: [TechnicalAoAiData.file, [Validators.required]],
    });
  }
  createForm() {
    this.TechnicalAoAi = this.fb.group({
      type: ['', [Validators.required]],
      subject: [''],
      reference: [''],
      TechnicalAoAiFile: [null, [Validators.required]],
    });
  }

  save() {
    // debugger
    const formData = new FormData();
    if (this.TechnicalAoAi.valid) {
      formData.append(
        'id',
        this.TechnicalAoAi.get('id')?.value
          ? this.TechnicalAoAi.get('id')?.value
          : '0'
      );
      formData.append('type', this.TechnicalAoAi.get('type')?.value);
      formData.append('subject', this.TechnicalAoAi.get('subject')?.value);
      formData.append('reference', this.TechnicalAoAi.get('reference')?.value);
      // Append the file to FormData
      const fileInput = this.TechnicalAoAi.get('TechnicalAoAiFile')?.value;
      if (fileInput) {
        formData.append('TechnicalAoAiFile', fileInput, fileInput.name); // Append the file
      }
      this.apiService.postWithHeader(this.apiUrl, formData).subscribe({
        next: (res) => {
          this.toastr.success(
            'TechnicalAoAi submitted successfully',
            'Success'
          );
          this.dialogRef.close(true);
        },
        error: (err) => {
          this.toastr.error('Error submitting TechnicalAoAi', 'Error');
        },
      });
    }
  }

  getReadableFileSize(size: number): string {
    if (size < 1024) return `${size} bytes`;
    else if (size < 1048576) return `${(size / 1024).toFixed(2)} KB`;
    else return `${(size / 1048576).toFixed(2)} MB`;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      const file = input.files[0];
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      ];
      if (allowedTypes.includes(file.type)) {
        this.fileName = file.name;
        this.fileSizeFormatted = this.getReadableFileSize(file.size);
        this.TechnicalAoAi.patchValue({
          TechnicalAoAiFile: file,
        });
      } else {
        this.fileName = null;
        this.fileSizeFormatted = null;
        alert(
          'Invalid file type! Only PDF, Word, and Excel files are allowed.'
        );
      }
    }
  }

  close() {
    this.dialogRef.close(true);
  }
  reset() {
    this.createForm();
  }
}
