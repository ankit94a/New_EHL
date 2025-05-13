import { Component, OnInit, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BISMatDialogService } from 'projects/shared/src/service/insync-mat-dialog.service';
import { SharedLibraryModule } from 'projects/shared/src/shared-library.module';
import { CategoryComponent } from './category/category.component';
import { SubCategoryComponent } from './sub-category/sub-category.component';
import {
  Category,
  Eqpt,
  SubCategory,
  Wing,
} from 'projects/shared/src/models/attribute.model';
import { ApiService } from 'projects/shared/src/service/api.service';
import { TablePaginationSettingsConfig } from 'projects/shared/src/component/zipper-table/table-settings.model';
import { ZipperTableComponent } from 'projects/shared/src/component/zipper-table/zipper-table.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { EqptComponent } from './eqpt/eqpt.component';
import { WingComponent } from './wing/wing.component';
import { DeleteModel } from '../../../../shared/src/models/attribute.model';
import { ToastrService } from 'ngx-toastr';
import { EncryptionService } from 'projects/shared/src/service/encryption.service';


@Component({
  selector: 'app-attribute',
  standalone: true,
  imports: [SharedLibraryModule, RouterModule],
  templateUrl: './attribute.component.html',
  styleUrl: './attribute.component.scss',
})
export class AttributeComponent {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  categoryList: Category[] = [];
  wing: Wing[] = [];
  subCategoryList: SubCategory[] = [];
  eqptList: Eqpt[] = [];
  activeTab: string = 'wing';
  displayedColumns: string[] = ['name', 'actions'];
  dataSource = new MatTableDataSource<Category>(this.categoryList);
  data = new MatTableDataSource<Wing>(this.wing);
  dataSource1 = new MatTableDataSource<Category>(this.subCategoryList);
  dataSource2 = new MatTableDataSource<Category>(this.eqptList);
  categoryId: number;
  subCategoryId: number;
  wingId: number;
  paginatorLength:number;
  constructor(
    private dialogService: BISMatDialogService,
    private apiService: ApiService,
    private toastr: ToastrService,
      private EncryptionService:EncryptionService,
  ) {
    this.getWing();
  }

  public async onTabChange(event) {
    const selectedTab = event.index;
    switch (selectedTab) {
      case 0:
        this.activeTab = 'wing';
        this.getWing();
        break;
      case 1:
        this.activeTab = 'category';
        this.getCategory(this.wingId);
        break;
      case 2:
        this.activeTab = 'subcategory';
        this.getCategory(this.wingId);
        this.getSubCategory(this.categoryId);
        break;
      case 3:
        this.activeTab = 'eqpt'; // emer tha
        this.getCategory(this.wingId);
        this.getSubCategory(this.categoryId);
        this.getEqpt();
        // if(this.categoryList.length == 0){

        // }
        // await this.getCategory(this.wingId);

        // this.getSubCategory(this.categoryId);
        break;
      default:
        break;
    }
  }
  edit(item) {
    item.isEdit = true;
    if (this.activeTab === 'wing') {
      this.dialogService.open(WingComponent, item, '40vw').then((res) => {
        if (res) {
          this.getWing();
        }
      });
    } else if (this.activeTab === 'category') {
      this.dialogService.open(CategoryComponent, item, '40vw').then((res) => {
        if (res) {
          this.getCategory(this.wingId);
        }
      });
    } else if (this.activeTab === 'subcategory') {
      this.dialogService
        .open(SubCategoryComponent, item, '40vw')
        .then((res) => {
          if (res) {
            this.getSubCategory(this.categoryId);
          }
        });
    } else if (this.activeTab === 'eqpt') {
      this.dialogService.open(EqptComponent, item, '40vw').then((res) => {});
    }
  }
  view(item) {}
  updateList(item: string, index: number) {
    if (item === 'wing') {
      this.getWing();
    } else if (item === 'category') {
      this.getCategory(this.wingId);
    } else if (item === 'subcategory') {
      this.getSubCategory(this.categoryId);
    } else if (item === 'eqpt') {
      this.getEqpt();
    }
  }
  delete(row) {
    let deleteAttr: DeleteModel = new DeleteModel();
    deleteAttr.Id = row.id;
    deleteAttr.TableName = this.activeTab;
    this.dialogService
      .confirmDialog('Are you sure you want to delete this Attribute?')
      .subscribe((res) => {
        if (res) {
          this.apiService
            .postWithHeader(`attribute/delete`, deleteAttr)
            .subscribe({
              next: (res) => {
                this.updateList(this.activeTab, row.index);
                //  onTabChange(this.activeTab);

                //  this.onTabChange= this.onTabChange.splice(row.index, 1);
                this.toastr.success('Deleted Successfully', 'Success');
                // this.dialogRef?.close(true);
              },
              error: (err) => {
                this.toastr.error('Failed to Delete', 'Error');
                console.error(err);
              },
            });
        }
      });
  }

  getWing() {
    this.apiService.getWithHeaders('attribute/wing').subscribe((res) => {
      if (res) {
        this.wing = res;
        this.data.data = this.wing;
        this.data.paginator = this.paginator;
        this.data.sort = this.sort;
        this.wingId = this.wing[0].id;
        this.paginatorLength = this.wing.length
      }
    });
  }
  getCategory(wingId) {
    this.apiService
      .getWithHeaders('attribute/category' + wingId)
      .subscribe((res) => {
        if (res) {
          debugger
          this.categoryList = res;
          this.dataSource.data = this.categoryList;
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.categoryId = this.categoryList[0].id;
          this.wingId = this.categoryList[0].wingId;
          this.paginatorLength = this.categoryList.length
          // this.getSubCategory(this.categoryId);
        }
      });
  }
  getSubCategory(categoryId) {
    if (this.categoryList.length > 0 && categoryId == undefined) {
      categoryId = this.categoryList[0].id;
    }
    this.apiService
      .getWithHeaders('attribute/subcategory' + categoryId)
      .subscribe((res) => {

        if (res) {
          this.subCategoryList = res;
        this.subCategoryList = res.map(item => ({
        ...item,
        wingId: this.wingId
      }));
      debugger
      this.paginatorLength = this.subCategoryList.length
          this.dataSource1.data = this.subCategoryList;
          this.dataSource1.paginator = this.paginator;
          this.dataSource1.sort = this.sort;
          this.subCategoryId = this.subCategoryList[0].id;
          this.getEqpt();
        }
      });
  }
  getEqpt() {
    this.apiService
      .getWithHeaders(
        'attribute/eqpt' + this.categoryId + '/' + this.subCategoryId
      )
      .subscribe((res) => {
        if (res) {
          this.eqptList = res;
            this.eqptList = res.map(item => ({
        ...item,
        wingId: this.wingId
      }));
      this.paginatorLength = this.eqptList.length
          this.dataSource2.data = this.eqptList;
          this.dataSource2.paginator = this.paginator;
          this.dataSource2.sort = this.sort;
        }
      });
  }
  addWing() {
    this.dialogService.open(WingComponent, null, '30vw').then((res) => {
      if (res) {
        this.getWing();
      }
    });
  }
  addCategory() {

    this.dialogService.open(CategoryComponent, null, '30vw').then((res) => {

      if (res) {

        this.getCategory(this.wingId);
      }

    });
  }
  addSubCategory() {
    this.dialogService.open(SubCategoryComponent,null, '40vw').then((res) => {
      if (res) {
        this.getSubCategory(this.categoryId);
      }
    });
  }
  addEqpt() {
    this.dialogService.open(EqptComponent, null, '40vw').then((res) => {});
  }
}
