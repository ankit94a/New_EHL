import { Component } from '@angular/core';
import { TablePaginationSettingsConfig } from 'projects/shared/src/component/zipper-table/table-settings.model';
import { ZipperTableComponent } from 'projects/shared/src/component/zipper-table/zipper-table.component';
import { Policy } from 'projects/shared/src/models/policy&misc.model';
import { ApiService } from 'projects/shared/src/service/api.service';
import { AuthService } from 'projects/shared/src/service/auth.service';
import { SharedLibraryModule } from 'projects/shared/src/shared-library.module';

@Component({
  selector: 'app-misc',
  standalone: true,
  imports: [SharedLibraryModule,ZipperTableComponent],
  templateUrl: './misc.component.html',
  styleUrl: './misc.component.scss'
})
export class MiscComponent  extends TablePaginationSettingsConfig{
 defectReports:Policy[]=[];
  filterModel:Policy = new Policy();
  isRefresh:boolean=false;
  constructor(private authService:AuthService,private apiService:ApiService){
    super();
    // this.tablePaginationSettings.enableAction = true;
    this.tablePaginationSettings.enableEdit = true;
    // this.tablePaginationSettings.enableView = true;
    // this.tablePaginationSettings.enableDelete = true;
    this.tablePaginationSettings.enableColumn = true;
    this.tablePaginationSettings.pageSizeOptions = [50, 100];
    this.tablePaginationSettings.showFirstLastButtons = false;
    this.filterModel.wingId = parseInt(this.authService.getWingId())
    this.filterModel.type = 'Misc'
    this.getPolicyByWing();
  }
  openDailog(){

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
      name: 'remarks', displayName: 'Remarks', isSearchable: true,hide: false,type:'text'
    }
  ]
}
