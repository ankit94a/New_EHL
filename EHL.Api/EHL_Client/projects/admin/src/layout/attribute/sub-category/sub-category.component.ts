import { Component, Inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import {
  Category,
  SubCategory,
  Wing,
} from 'projects/shared/src/models/attribute.model';
import { ApiService } from 'projects/shared/src/service/api.service';
import { SharedLibraryModule } from 'projects/shared/src/shared-library.module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-sub-category',
  standalone: true,
  imports: [SharedLibraryModule],
  templateUrl: './sub-category.component.html',
  styleUrl: './sub-category.component.scss',
})
export class SubCategoryComponent {
  subCategory: SubCategory = new SubCategory();
  categoryList: Category[] = [];
  wing: Wing[] = [];
  wingId: number= 0;
  categoryId: number;
  apiUrl: string = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) data: any,
    private apiService: ApiService,
    private toastr: ToastrService,
    private dailogRef: MatDialogRef<SubCategoryComponent>
  ) {
    debugger
    this.getWing();
    if (data != null) {
       this.getCategory(data.wingId);
       this.categoryId = data.categoryId;
      this.bindDataToForm(data),
      this.apiUrl='attribute/subcategory/update'
    } else {
      this.createForm();
      this.apiUrl ='attribute/subcategory'
    }
  }

  bindDataToForm(attrData) {
    (this.subCategory.id = attrData.id),
      (this.subCategory.categoryId = attrData.categoryId),
      (this.subCategory.wingId = attrData.wingId),
      (this.subCategory.categoryId = attrData.categoryId),
      (this.subCategory.name = attrData.name);
      this.filterCategory(attrData.categoryId)
  }
  createForm() {
    (this.subCategory.id = 0),
      (this.subCategory.categoryId = 0),
      (this.subCategory.name = '');
  }
  getWing() {

    this.apiService.getWithHeaders('attribute/wing').subscribe((res) => {
      if (res) {
        this.wing = res;
      }
    });
  }
  filterCategory(categoryId) {
    this.categoryList = this.categoryList.filter((x) => x.id == categoryId);
    return this.subCategory;
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
  save() {
    debugger
    this.apiService
      .postWithHeader(this.apiUrl, this.subCategory)
      .subscribe((res) => {
        if (res) {
          this.toastr.success('Sub-Category added successfully', 'success');
          this.dailogRef.close(true);
        }
      });
  }
}
