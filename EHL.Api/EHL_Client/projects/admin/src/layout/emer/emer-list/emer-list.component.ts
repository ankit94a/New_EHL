import { Component } from '@angular/core';
import { BISMatDialogService } from 'projects/shared/src/service/insync-mat-dialog.service';
import { SharedLibraryModule } from 'projects/shared/src/shared-library.module';
import { EmerAddComponent } from '../emer-add/emer-add.component';
import { ApiService } from 'projects/shared/src/service/api.service';
import { TablePaginationSettingsConfig } from 'projects/shared/src/component/zipper-table/table-settings.model';
import { ZipperTableComponent } from 'projects/shared/src/component/zipper-table/zipper-table.component';
import { Category } from 'projects/shared/src/models/attribute.model';
import { EmerModel } from 'projects/shared/src/models/emer.model';
import { DownloadService } from 'projects/shared/src/service/download.service';
import { PolicyFilterModel } from 'projects/shared/src/models/policy&misc.model';
import { AuthService } from 'projects/shared/src/service/auth.service';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-emer-list',
  standalone: true,
  imports: [SharedLibraryModule,ZipperTableComponent,NgxSpinnerModule ],
  templateUrl: './emer-list.component.html',
  styleUrl: './emer-list.component.scss'
})
export class EmerListComponent extends TablePaginationSettingsConfig{
  emerList:EmerModel[]=[];
  isRefresh:boolean=false;
   filterModel:PolicyFilterModel = new PolicyFilterModel();
   userType;
    // categoryList:Category[]=[];
  constructor(private spinner: NgxSpinnerService,private dialoagService:BISMatDialogService,private apiService:ApiService,private downloadService:DownloadService,private authService:AuthService){
    super();
    this.userType = this.authService.getRoleType()
    this.tablePaginationSettings.enableAction = true;
    if(this.userType != '2'){
      this.tablePaginationSettings.enableEdit = true;
      this.tablePaginationSettings.enableDelete = true;
    }
    this.tablePaginationSettings.enableColumn = true;
    this.tablePaginationSettings.pageSizeOptions = [50, 100];
    this.tablePaginationSettings.showFirstLastButtons = false
    this.filterModel.wingId = parseInt(this.authService.getWingId())
    // this.getCategory()
    this.getList();
  }
  getList(){
    this.spinner.show();
    this.apiService.getWithHeaders('emer/wing/'+this.filterModel.wingId).subscribe(res =>{
      if(res){
        this.spinner.hide();
        this.emerList = res;
      }
    })
  }
  edit(row){

    row.isEdit = true;
    this.dialoagService.open(EmerAddComponent,row).then(res =>{
      if(res){
        this.getList()
      }
    });
  }
  // view(row){
  //   row.isEdit = false;
  //   this.dialoagService.open(EmerAddComponent,row)
  // }
  del(row){
    debugger
    this.dialoagService.confirmDialog(`Are you sure you want to delete EMER ${row.item.emerNumber}?`).subscribe(res =>{
      if(res){
        this.apiService.deleteWithHeaders(`emer/${row.item.id}`).subscribe(res =>{
          if(res){
            this.emerList = this.emerList.splice(row.index,1)
          }
        })
      }
    })
  }
  openDialog(){
    this.dialoagService.open(EmerAddComponent,null).then(res =>{
      if(res){
        this.getList()
      }
    });
  }

  getFileId(row: any) {

    // var result = this.downloadService.download(row.filePath,'file/download')
    // this.apiService.getWithHeaders(`file/download/${row.fileId}`).subscribe(response => {

    //   if (response) {
    //     const blob = new Blob([response], { type: response.type });
    //     const url = window.URL.createObjectURL(blob);
    //     const a = document.createElement('a');
    //     a.href = url;
    //     a.download = this.getFileNameFromResponse(response);
    //     document.body.appendChild(a);
    //     a.click();
    //     document.body.removeChild(a);
    //     window.URL.revokeObjectURL(url);
    //   }
    // });
  }
  private getFileNameFromResponse(response: any): string {
    const contentDisposition = response.headers.get('content-disposition');
    if (contentDisposition) {
      const matches = contentDisposition.match(/filename="(.+)"/);
      return matches ? matches[1] : 'downloaded_file';
    }
    return 'downloaded_file';
  }

  getReadableFileSize(size: number): string {
    if (size < 1024) return `${size} bytes`;
    else if (size < 1048576) return `${(size / 1024).toFixed(2)} KB`;
    else return `${(size / 1048576).toFixed(2)} MB`;
  }
  columns = [
    // {
    //   name: 'id', displayName: 'Id', isSearchable: true,hide: false,type:'text'
    // },
    {
      name: 'fileName', displayName: 'File', isSearchable: true,hide: false,valueType:'link',valuePrepareFunction:(row) =>{
        return row.fileName
      }
    },
    {
      name: 'category', displayName: 'Category', isSearchable: true,hide: false,type:'text'
    },
    {
      name: 'subCategory', displayName: 'Sub Category', isSearchable: true,hide: false,type:'text'
    },
    {
      name: 'eqpt', displayName: 'EQPT', isSearchable: true,hide: false,type:'text'
    },
    {
      name: 'emerNumber', displayName: 'EmerNumber', isSearchable: true,hide: false,type:'text'
    },
    {
      name: 'subject', displayName: 'Subject', isSearchable: true,hide: false,type:'text'
    },
    {
      name: 'subFunction', displayName: 'Sub Funtion', isSearchable: true,hide: false,type:'text'
    },
    {
      name: 'subFunctionCategory', displayName: 'Sub FunctionCategory', isSearchable: true,hide: true,type:'text'
    },
    {
      name: 'subFunctionType', displayName: 'Sub FunctionType', isSearchable: true,hide: true,type:'text'
    },
    {
      name: 'remarks', displayName: 'Remarks', isSearchable: true,hide: true,type:'text'
    },

  ]
}
