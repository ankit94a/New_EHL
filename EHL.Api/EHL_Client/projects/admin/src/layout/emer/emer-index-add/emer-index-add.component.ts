import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Category, Wing } from 'projects/shared/src/models/attribute.model';
import { ApiService } from 'projects/shared/src/service/api.service';
import { AuthService } from 'projects/shared/src/service/auth.service';
import { SharedLibraryModule } from 'projects/shared/src/shared-library.module';

@Component({
  selector: 'app-emer-index-add',
  standalone: true,
  imports: [SharedLibraryModule],
  templateUrl: './emer-index-add.component.html',
  styleUrl: './emer-index-add.component.scss',
})
export class EmerIndexAddComponent {
  emerForm: FormGroup;
  wingId: number;
  wingName: string;
  wing: Wing[] = [];
  fileName: string | null = null;
  filePath: string = '';
  fileSizeFormatted: string | null = null;
  categoryList: Category[] = [];
  alertMessage: string = '';
  apiUrl: string = '';
  constructor(
    @Inject(MAT_DIALOG_DATA) data,
    private authService: AuthService,
    private apiService: ApiService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private dialogRef: MatDialogRef<EmerIndexAddComponent>
  ) {
    this.wingId = parseInt(this.authService.getWingId());
    this.getWing();
    // this.createForm();
    if (data) {
      this.bindDataToForm(data.data);
    } else {
      this.createForm();
    }
  }
  getWing() {
    this.apiService.getWithHeaders('attribute/wing').subscribe((res) => {
      if (res) {
        this.wing = res;
        this.wingName =
          this.wing.find((item) => item.id == this.wingId)?.name || '';
        this.getCategory(this.wingId);
      }
    });
  }
  bindDataToForm(form) {

    this.getCategory(form.wingId);
    this.fileName = form.fileName;
    this.fileSizeFormatted = '';
    this.filePath = form.filePath;
    this.emerForm = this.fb.group({
      emerNumber: [form.emerNumber, [Validators.required]],
      subject: [form.subject, [Validators.required]],
      category: [form.category, [Validators.required]],
      categoryId: [form.categoryId, [Validators.required]],
      id: [form.id],
      wingId: [form.wingId, [Validators.required]],
      Wing: [''],
      emerFile: [form.emerFile, [Validators.required]],
    });
  }
  createForm() {
    this.emerForm = this.fb.group({
      emerNumber: ['', [Validators.required]],
      subject: ['', [Validators.required]],
      wing: [''],
      wingId: [{ value: this.wingId, disabled: true }, [Validators.required]],
      categoryId: ['', [Validators.required]],
      emerFile: [null, [Validators.required]],
    });
  }
  // getCategory() {
  //   this.apiService.getWithHeaders('attribute/category' + this.wingId).subscribe((res) => {
  //       if (res) {
  //         this.categoryList = res;
  //       }
  //     });
  // }
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
        this.emerForm.patchValue({ emerFile: file });
        this.alertMessage = '';
      } else {
        this.fileName = null;
        this.fileSizeFormatted = null;
        this.alertMessage =
          'Invalid file type! Only PDF, Word, and Excel files are allowed.';
      }
    }
  }
  getReadableFileSize(size: number): string {
    if (size < 1024) return `${size} bytes`;
    else if (size < 1048576) return `${(size / 1024).toFixed(2)} KB`;
    else return `${(size / 1048576).toFixed(2)} MB`;
  }
  removeFile(): void {
    this.fileName = null;
    this.fileSizeFormatted = null;
    this.emerForm.patchValue({
      emerFile: null,
    });
    // Clear the file input as well
    const fileInput = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }
  getCategory(wingId) {
    this.apiService
      .getWithHeaders('attribute/category' + wingId)
      .subscribe((res) => {
        if (res) {
          this.categoryList = res;
        }
      });
  }
  close() {
    this.dialogRef.close(true);
  }
  reset() {
    this.createForm();
    this.fileName = '';
    this.fileSizeFormatted = '';
  }
  save() {
    const formData = new FormData();
    const emerId = this.emerForm.get('id')?.value;
    const wingId = this.emerForm.get('wingId')?.value;
    const categoryId = this.emerForm.get('categoryId')?.value;
    const category =
      this.categoryList.find((item) => item.id == categoryId)?.name || '';
    formData.append('category', category);
    //index edit

    if (emerId > 0) {
      this.apiUrl = 'emer/index/update';
      const fileInput = this.emerForm.get('emerFile')?.value;
      if (fileInput) {
        formData.append('emerFile', fileInput, fileInput.name);
      } else {
        formData.append('fileName', this.fileName);
        formData.append('filePath', this.filePath);
      }
      formData.append('id', emerId);
      formData.append('emerNumber', this.emerForm.get('emerNumber')?.value);
      formData.append('wingId', wingId);
      formData.append('categoryId', categoryId);
      formData.append('subject', this.emerForm.get('subject')?.value);
      formData.append('wing', this.wingName);
      this.apiService.postWithHeader(this.apiUrl, formData).subscribe({
        next: (res) => {
          this.toastr.success('Form submitted successfully', 'Success');
          this.dialogRef.close(true);
        },
        error: (err) => {
          console.error('Error submitting form:', err);
          this.toastr.error('Error submitting form', 'Error');
        },
      });
    }
    //index add
    else {
      this.apiUrl = 'emer/index';
      const fileInput = this.emerForm.get('emerFile')?.value;
      if (fileInput) {
        formData.append('emerFile', fileInput, fileInput.name);
      } else {
        formData.append('fileName', this.fileName);
        formData.append('filePath', this.filePath);
      }
      if (this.emerForm.valid) {
        formData.append('emerNumber', this.emerForm.get('emerNumber')?.value);
        formData.append('wingId', wingId);
        formData.append('categoryId', categoryId);
        formData.append('subject', this.emerForm.get('subject')?.value);
        formData.append('wing', this.wingName);
        this.apiService.postWithHeader(this.apiUrl, formData).subscribe({
          next: (res) => {
            this.toastr.success('Form submitted successfully', 'Success');
            this.dialogRef.close(true);
          },
          error: (err) => {
            console.error('Error submitting form:', err);
            this.toastr.error('Error submitting form', 'Error');
          },
        });
      } else {
        const fileInput = this.emerForm.get('emerFile')?.value;
        if (!fileInput) this.alertMessage = 'File is required';
        this.emerForm.markAllAsTouched();
        return;
      }
    }
  }
}
