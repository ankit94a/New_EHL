import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import {
  Category,
  Eqpt,
  SubCategory,
  Wing,
} from 'projects/shared/src/models/attribute.model';
import { EmerModel } from 'projects/shared/src/models/emer.model';
import { ApiService } from 'projects/shared/src/service/api.service';
import { AuthService } from 'projects/shared/src/service/auth.service';
import { SharedLibraryModule } from 'projects/shared/src/shared-library.module';

@Component({
  selector: 'app-emer-add',
  standalone: true,
  imports: [SharedLibraryModule],
  templateUrl: './emer-add.component.html',
  styleUrl: './emer-add.component.scss',
})
export class EmerAddComponent {
  emerForm: FormGroup;
  categoryList: Category[] = [];
  subCategoryList: SubCategory[] = [];
  eqptList: Eqpt[] = [];
  fileName: string | null = null;
  fileSizeFormatted: string | null = null;
  wing: Wing[] = [];
  subNarrowFunctionDropdown = [];
  SubFunctionType = [];
  wingId: number;
  filePath;
  rawInput: string = '';
  filteredInput: string = '';
  alertMessage: string = '';
  apiUrl:string = 'emer';
  constructor(@Inject(MAT_DIALOG_DATA) data,private authService: AuthService, private apiService: ApiService,private fb: FormBuilder,private dialogRef: MatDialogRef<EmerAddComponent>,private toastr: ToastrService) {
    this.wingId = parseInt(this.authService.getWingId());
    if (data) {
      this.bindDataToForm(data);
      this.apiUrl = 'emer/update'
    } else {
      this.createForm();
    }
    this.getWing();
  }
  getWing() {
    this.apiService.getWithHeaders('attribute/wing').subscribe((res) => {
      if (res) {
        this.wing = res;
        this.getCategory(this.wingId);
      }
    });
  }
  bindDataToForm(form) {

    this.emerForm = this.fb.group({
      emerNumber: [form.emerNumber, [Validators.required]],
      subject: [form.subject, [Validators.required]],
      subFunction: [form.subFunction, [Validators.required]],
      wing: [form.wing],
      category: [form.category],
      subCategory: [form.subCategory],
      wingId: [{ value: form.wingId, disabled: true }, [Validators.required]],
      categoryId: [form.categoryId, [Validators.required]],
      subCategoryId: [form.subCategoryId, [Validators.required]],
      eqpt: [form.eqpt, [Validators.required]],
      emerFile: [form.emerFile, [Validators.required]],
      remarks: [form.remarks],
      id: [form.id],
    });
    this.fileName = form.fileName;
    this.fileSizeFormatted = 'Not Defined';
    this.filePath = form.filePath;
    this.getCategory(form.wingId);
    this.getSubCategory(form.categoryId);
    this.getEqpt(form.subCategoryId);
  }

  createForm() {
    this.emerForm = this.fb.group({
      emerNumber: ['', [Validators.required]],
      subject: ['', [Validators.required]],
      subFunction: ['', [Validators.required]],
      wing: [''],
      category: [''],
      subCategory: [''],
      wingId: [{ value: this.wingId, disabled: true }, [Validators.required]],
      categoryId: ['', [Validators.required]],
      subCategoryId: ['', [Validators.required]],
      eqpt: ['', [Validators.required]],
      emerFile: [null, [Validators.required]],
      subFunctionCategory: [''],
      subFunctionType: [''],
      remarks: [''],
    });
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
  getSubCategory(categoryId) {
    this.apiService
      .getWithHeaders('attribute/subcategory' + categoryId)
      .subscribe((res) => {
        if (res) {
          this.subCategoryList = res;
        }
      });
  }
  getEqpt(subCategoryId) {
    let categoryId = this.emerForm.get('categoryId')?.value;
    this.apiService
      .getWithHeaders('attribute/eqpt' + categoryId + '/' + subCategoryId)
      .subscribe((res) => {
        if (res) {
          this.eqptList = res;
        }
      });
  }

  getReadableFileSize(size: number): string {
    if (size < 1024) return `${size} bytes`;
    else if (size < 1048576) return `${(size / 1024).toFixed(2)} KB`;
    else return `${(size / 1048576).toFixed(2)} MB`;
  }

  onFileSelected(event: Event): void {
    debugger
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
        this.emerForm.patchValue({ emerFile: file, });
        this.alertMessage = '';
      } else {
        this.fileName = null;
        this.fileSizeFormatted = null;
        this.alertMessage = 'Invalid file type! Only PDF, Word, and Excel files are allowed.'

      }
    }
  }

  removeFile(): void {
    this.fileName = null;
    this.fileSizeFormatted = null;
    this.filePath = null;
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

  getSubFunctionType(type) {
    if (type == 'Initial stocking guides') {
      this.SubFunctionType = ['ISG1', 'ISG2'];
    } else if (type == 'maintenance scales') {
      this.SubFunctionType = ['MS1', 'MS2'];
    } else {
      this.SubFunctionType = [];
    }
  }

  getSubFunctionField(subFunction) {
    if (subFunction == 'SCALES') {
      this.subNarrowFunctionDropdown = [
        'Initial stocking guides and maintenance scales',
        'Initial stocking guides',
        'maintenance scales',
        'Special maintenance scales',
        'War maintenance scales',
        'Special maintenance tools',
      ];
    } else if (subFunction == 'INSPECTION STD AND CONDEMNATION LIMITS') {
      this.subNarrowFunctionDropdown = ['Field Ins Stds', 'Base Insp Stds'];
    } else {
      this.subNarrowFunctionDropdown = [];
      this.SubFunctionType = [];
      this.emerForm.get('subFunctionType')?.setValue('');
      this.emerForm.get('subFunctionCategory')?.setValue('');
    }
  }
  close() {
    this.dialogRef.close(true);
  }
  reset() {
    this.createForm();
  }

  save() {
    debugger
    const emerId = this.emerForm.get('id')?.value;
    const formData = new FormData();
    // edit emer
    if (emerId > 0) {
      const fileInput = this.emerForm.get('emerFile')?.value;
      if (fileInput) {
        formData.append('emerFile', fileInput, fileInput.name);
      }
    }
    // add new emer
    else {
      if (this.emerForm.valid) {
        const wing = this.wing.find((item) => item.id == this.emerForm.get('wingId')?.value)?.name || '';
        const category = this.categoryList.find((item) => item.id == this.emerForm.get('categoryId')?.value)?.name || '';
        const subCategory = this.subCategoryList.find((item) => item.id == this.emerForm.get('subCategoryId')?.value)?.name || '';

        formData.append('wing', wing);
        formData.append('category', category);
        formData.append('subCategory', subCategory);
        formData.append('wingId', this.emerForm.get('wingId')?.value);
        formData.append('categoryId', this.emerForm.get('categoryId')?.value);
        formData.append('subCategoryId', this.emerForm.get('subCategoryId')?.value);
        formData.append('emerNumber', this.emerForm.get('emerNumber')?.value);
        formData.append('subject', this.emerForm.get('subject')?.value);
        formData.append('subFunction', this.emerForm.get('subFunction')?.value);
        formData.append('subFunctionCategory', this.emerForm.get('subFunctionCategory')?.value);
        formData.append('subFunctionType', this.emerForm.get('subFunctionType')?.value);
        formData.append('eqpt', this.emerForm.get('eqpt')?.value);
        formData.append('remarks', this.emerForm.get('remarks')?.value);
        formData.append('emerFile', this.emerForm.get('emerFile')?.value);
        this.apiService.postWithHeader(this.apiUrl, formData).subscribe({
        next: (res) => {
          this.toastr.success('Form submitted successfully', 'Success');
          this.dialogRef.close(true);
        },
        error: (err) => {
          this.toastr.error('Error submitting form', 'Error');
        },
      });
      } else {
        const fileInput = this.emerForm.get('emerFile')?.value;
        if (!fileInput)
          this.alertMessage = 'File is required';
        this.emerForm.markAllAsTouched();
        return;
      }
    }





    // if (this.emerForm.valid || emerId > 0) {




    //   let apiUrl = '';
    //   if (emerId) {
    //     formData.append('id', emerId);
    //     formData.append('fileName', this.fileName);
    //     formData.append('filePath', this.filePath);
    //     apiUrl = 'emer/update';
    //   } else {
    //     apiUrl = 'emer';
    //   }


    // }
  }
}
