import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'projects/shared/src/service/api.service';
import { Category, Eqpt, SubCategory, Wing } from 'projects/shared/src/models/attribute.model';
import { SharedLibraryModule } from 'projects/shared/src/shared-library.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'projects/shared/src/service/auth.service';

@Component({
  selector: 'app-ep-contract-add',
  standalone: true,
  imports: [SharedLibraryModule],
  templateUrl: './ep-contract-add.component.html',
  styleUrl: './ep-contract-add.component.scss'
})
export class EpContractAddComponent {
  policy: FormGroup;
  categoryList: Category[] = [];
  wingList: Wing[] = [];
  subCategoryList: SubCategory[] = [];
  eqptList: Eqpt[] = [];
  fileName: string | null = null;
  fileSizeFormatted: string | null = null;
  wingId:number;
  constructor(private authService:AuthService, @Inject(MAT_DIALOG_DATA) data,private dialogRef:MatDialogRef<EpContractAddComponent>, private apiService: ApiService,private fb: FormBuilder,private toastr: ToastrService,private dailogRef: MatDialogRef<EpContractAddComponent>) {
    this.wingId = parseInt(this.authService.getWingId())
    this.getWings();
    if(data != null){
      this.bindDataToForm(data)
    }else{
      this.createForm();
    }

  }
  bindDataToForm(policyData){
    this.getCategory(policyData.wingId)
    this.policy = this.fb.group({
      type: [{value: policyData.type,disabled:true}, [Validators.required]],
      wingId: [{value:policyData.wingId,disabled:true}, [Validators.required]],
      categoryId: [{value:policyData.categoryId,disabled:true}, [Validators.required]],
      policyFile: [null, [Validators.required]],
      remarks: [{value:policyData.remarks,disabled:true}],
    });
  }
  createForm() {
    this.policy = this.fb.group({
      type: [ {value: 'EP Contract',disabled:true}, [Validators.required]],
      wingId: [{ value: this.wingId, disabled: true }, [Validators.required]],
      categoryId: ['', [Validators.required]],
      policyFile: [null, [Validators.required]],
      remarks: [''],
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
    let categoryId = this.policy.get('categoryId')?.value;
    this.apiService
      .getWithHeaders('attribute/eqpt' + categoryId + '/' + subCategoryId)
      .subscribe((res) => {
        if (res) {
          this.eqptList = res;
        }
      });
  }
  save() {
    const formData = new FormData();
    var wing = this.wingList.find(
      (item) => item.id == this.policy.get('wingId')?.value
    ).name;
    var category = this.categoryList.find(
      (item) => item.id == this.policy.get('categoryId')?.value
    ).name;

    formData.append('wing', wing);
    formData.append('category', category);
    if (this.policy.valid) {
      formData.append('type', this.policy.get('type')?.value);
      formData.append('wingId', this.policy.get('wingId')?.value);
      formData.append('categoryId', this.policy.get('categoryId')?.value);
      formData.append('policyFile', this.policy.get('policyFile')?.value);
      formData.append('remarks', this.policy.get('remarks')?.value);

      // Append the file to FormData
      const fileInput = this.policy.get('policyFile')?.value;
      if (fileInput) {
        formData.append('policyFile', fileInput, fileInput.name); // Append the file
      }
      this.apiService.postWithHeader('policy', formData).subscribe({
        next: (res) => {
          this.toastr.success('Policy submitted successfully', 'Success');
          this.dialogRef.close(true);
        },
        error: (err) => {
          this.toastr.error('Error submitting policy', 'Error');
        }
      });
    }
  }
  getWings() {
    this.apiService.getWithHeaders('attribute/wing').subscribe((res) => {
      if (res) {
        this.wingList = res;
        this.getCategory(this.wingId)
      }
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
        this.policy.patchValue({
          policyFile: file,
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
    this.dailogRef.close(true);
  }
  reset() {
    this.createForm();
  }
}
