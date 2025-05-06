import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'projects/shared/src/service/api.service';
import { Category, Eqpt, SubCategory, Wing } from 'projects/shared/src/models/attribute.model';
import { SharedLibraryModule } from 'projects/shared/src/shared-library.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'projects/shared/src/service/auth.service';

@Component({
   imports: [SharedLibraryModule],
  selector: 'app-defect-report-add',
  standalone: true,
  templateUrl: './defect-report-add.component.html',
  styleUrl: './defect-report-add.component.scss'
})
export class DefectReportAddComponent {
  policy: FormGroup;
  categoryList: Category[] = [];
  wingList: Wing[] = [];
  subCategoryList: SubCategory[] = [];
    eqptList: Eqpt[] = [];
  fileName: string | null = null;
  fileSizeFormatted: string | null = null;
  wingId:number;
  categoryId:number;
  apiUrl:string='';
  constructor(private authService:AuthService, @Inject(MAT_DIALOG_DATA) data,private dialogRef:MatDialogRef<DefectReportAddComponent>, private apiService: ApiService,private fb: FormBuilder,private toastr: ToastrService,private dailogRef: MatDialogRef<DefectReportAddComponent>) {
    this.wingId = parseInt(this.authService.getWingId())
    this.getWings();
    if(data != null){
       this.apiUrl = 'policy/update'
      this.bindDataToForm(data)
    }else{
       this.apiUrl = 'policy'
      this.createForm();
    }

  }
  bindDataToForm(policyData){
    // debugger
    this.getCategory(policyData.wingId)
    this.getSubCategory(policyData.categoryId)
    this.policy = this.fb.group({
      id:[policyData.id],
      type: [{value: policyData.type,disabled:true}, [Validators.required]],
      wingId: [{value:policyData.wingId,disabled:true}, [Validators.required]],
      categoryId: [policyData.categoryId, [Validators.required]],
      category: [policyData.category, [Validators.required]],
      subCategory:[policyData.subCategory],
      subCategoryId: [policyData.subCategoryId,],
      eqpt:[policyData.eqpt],
      policyFile: [null, [Validators.required]],
      remarks: [policyData.remarks,],
    });
    this.getEqpt(policyData.subCategoryId)
  }
  createForm() {
    this.policy = this.fb.group({

      type: [{value:'Defect Report', disabled: true}, [Validators.required]],
      wingId: [{ value: this.wingId, disabled: true }, [Validators.required]],
      categoryId: ['', [Validators.required]],
      subCategory:[''],
      subCategoryId: [''],
      eqpt:[''],
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
    var subCategory = this.subCategoryList.find(
      (item) => item.id == this.policy.get('subCategoryId')?.value
    )?.name;

    formData.append('wing', wing);
    formData.append('category', category);
    if (this.policy.valid) {
      formData.append('id', this.policy.get('id')?.value ? this.policy.get('id')?.value : '0');
      formData.append('type', this.policy.get('type')?.value);
      formData.append('wingId', this.policy.get('wingId')?.value);
      formData.append('categoryId', this.policy.get('categoryId')?.value);
      formData.append('policyFile', this.policy.get('policyFile')?.value);
      formData.append('remarks', this.policy.get('remarks')?.value);
      formData.append('subCategoryId', this.policy.get('subCategoryId')?.value);
      formData.append('subCategory', subCategory || '');
      formData.append('eqpt', this.policy.get('eqpt')?.value);
      // Append the file to FormData
      const fileInput = this.policy.get('policyFile')?.value;
      if (fileInput) {
        formData.append('policyFile', fileInput, fileInput.name); // Append the file
      }
      this.apiService.postWithHeader(this.apiUrl, formData).subscribe({
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
