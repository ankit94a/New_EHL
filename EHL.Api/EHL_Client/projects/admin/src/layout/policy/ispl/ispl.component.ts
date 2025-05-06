import { Component } from '@angular/core';
import { TablePaginationSettingsConfig } from 'projects/shared/src/component/zipper-table/table-settings.model';
import { ZipperTableComponent } from 'projects/shared/src/component/zipper-table/zipper-table.component';
import { Policy, PolicyFilterModel } from 'projects/shared/src/models/policy&misc.model';
import { ApiService } from 'projects/shared/src/service/api.service';
import { AuthService } from 'projects/shared/src/service/auth.service';
import { SharedLibraryModule } from 'projects/shared/src/shared-library.module';
// import { DefectReportAddComponent } from './defect-report-add/defect-report-add.component';
import { BISMatDialogService } from 'projects/shared/src/service/insync-mat-dialog.service';
import { ToastrService } from 'ngx-toastr';
import { DeleteModel } from 'projects/shared/src/models/attribute.model';
import { IsplAddComponent } from './ispl-add/ispl-add.component';


@Component({
    selector: 'app-ispl',
  standalone: true,
  imports: [SharedLibraryModule,ZipperTableComponent],
  templateUrl: './ispl.component.html',
  styleUrl: './ispl.component.scss'
})
export class IsplComponent extends TablePaginationSettingsConfig{
  defectReports:Policy[]=[];
  filterModel:Policy = new Policy();
  isRefresh:boolean=false;
  userType;
  constructor(private authService:AuthService,private apiService:ApiService,private dialogService:BISMatDialogService,private toastr: ToastrService){
    super();
    this.userType = this.authService.getRoleType();
    this.tablePaginationSettings.enableAction = true;
    if(this.userType != '2'){
      this.tablePaginationSettings.enableEdit = true;
      // this.tablePaginationSettings.enableView = true;
      this.tablePaginationSettings.enableDelete = true;
    }

    this.tablePaginationSettings.enableColumn = true;
    this.tablePaginationSettings.pageSizeOptions = [50, 100];
    this.tablePaginationSettings.showFirstLastButtons = false;
    this.filterModel.wingId = parseInt(this.authService.getWingId())
    this.filterModel.type = 'ispl'
    this.getPolicyByWing();
  }
    openDailog(){
      this.dialogService.open(IsplAddComponent,null,'50vw').then(res =>{
        if(res){
          // this.getAll
        }
      })
    }
  getFileId(row){

  }
  getPolicyByWing(){
    this.apiService.postWithHeader('policy/type/',this.filterModel).subscribe(res =>{
      if(res){
        this.defectReports=res;
      }
    })
  }

 edit(row){
    row.isEdit = true;
    this.dialogService.open(IsplAddComponent,row)
  }
   delete(row) {
      let deleteDefectReport: DeleteModel = new DeleteModel();
      deleteDefectReport.Id = row.item.id;
      deleteDefectReport.TableName = "Policy";

      this.dialogService.confirmDialog("Would you like to delete This ISPL?").subscribe(res => {
        if (res) {
          this.apiService.postWithHeader(`attribute/delete`, deleteDefectReport).subscribe({
            next: (res) => {

             this.defectReports= this.defectReports.splice(row.index, 1);
              this.toastr.success('Deleted Successfully', 'Success');
              // this.dialogRef?.close(true);
            },
            error: (err) => {
              this.toastr.error('Failed to Delete', 'Error');
              console.error(err);
            }
          });
        }
      });
    }

  columns = [
    {
      name: 'fileName', displayName: 'File Name', isSearchable: true,hide: false,valueType:'link',valuePrepareFunction:(row) =>{
        return row.fileName
      }
    },
    {
      name: 'category', displayName: 'Category', isSearchable: true,hide: false,type:'text'
    },
    {
      name: 'subcategory', displayName: 'Sub Category', isSearchable: true,hide: false,type:'text'
    },
    {
      name: 'remarks', displayName: 'Remarks', isSearchable: true,hide: false,type:'text'
    }
  ]
}

