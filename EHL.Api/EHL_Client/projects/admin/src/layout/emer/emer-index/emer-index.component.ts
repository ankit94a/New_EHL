import { Component } from '@angular/core';
import { TablePaginationSettingsConfig } from 'projects/shared/src/component/zipper-table/table-settings.model';
import { ZipperTableComponent } from 'projects/shared/src/component/zipper-table/zipper-table.component';
import { EmerIndex } from 'projects/shared/src/models/emer.model';
import { ApiService } from 'projects/shared/src/service/api.service';
import { AuthService } from 'projects/shared/src/service/auth.service';
import { BISMatDialogService } from 'projects/shared/src/service/insync-mat-dialog.service';
import { SharedLibraryModule } from 'projects/shared/src/shared-library.module';
import { EmerIndexAddComponent } from '../emer-index-add/emer-index-add.component';
import { DeleteModel } from 'projects/shared/src/models/attribute.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-emer-index',
  standalone: true,
  imports: [SharedLibraryModule, ZipperTableComponent],
  templateUrl: './emer-index.component.html',
  styleUrl: './emer-index.component.scss',
})
export class EmerIndexComponent extends TablePaginationSettingsConfig {
  emerIndexList: EmerIndex[] = [];
  wingId: number;
  isRefresh: boolean = false;
  userType;
  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private dialogService: BISMatDialogService,
    private toastr: ToastrService
  ) {
    super();
    this.userType = this.authService.getRoleType();
    this.tablePaginationSettings.enableAction = true;
    if (this.userType == '1') {
      this.tablePaginationSettings.enableEdit = true;
      this.tablePaginationSettings.enableDelete = true;
    }
    this.tablePaginationSettings.enableColumn = true;
    this.tablePaginationSettings.pageSizeOptions = [50, 100];
    this.tablePaginationSettings.showFirstLastButtons = false;
    this.wingId = parseInt(this.authService.getWingId());
    this.getAllIndex();
  }
  edit(row) {
    row.isEdit = true;
    this.dialogService
      .open(EmerIndexAddComponent, { data: row })
      .then((res) => {
        if (res) {
          this.getAllIndex();
        }
      });
  }

  delete(row) {
    let deleteEmerIndex: DeleteModel = new DeleteModel();
    deleteEmerIndex.Id = row.item.id;
    deleteEmerIndex.TableName = 'emerindex';

    this.dialogService
      .confirmDialog(
        `Are you sure you want to delete EMER ${row.item.emerNumber}?`
      )
      .subscribe((res) => {
        if (res) {
          this.apiService
            .postWithHeader(`attribute/delete`, deleteEmerIndex)
            .subscribe({
              next: (res) => {
                //  this.emerIndexList= this.emerIndexList.splice(row.index, 1);
                this.toastr.success('Deleted Successfully', 'Success');
                this.getAllIndex();
              },
              error: (err) => {
                this.toastr.error('Failed to Delete', 'Error');
                console.error(err);
              },
            });
        }
      });
  }

  openDialog() {
    this.dialogService.open(EmerIndexAddComponent, null, '50vw').then((res) => {
      if (res) {
        // this.isRefresh = true;
        this.getAllIndex();
      }
    });
  }
  getFileId(row) {}
  getAllIndex() {
    this.apiService
      .getWithHeaders('emer/index/' + this.wingId)
      .subscribe((res) => {
        if (res) {
          this.emerIndexList = res;
        }
      });
  }
  columns = [
    {
      name: 'fileName',
      displayName: 'File',
      isSearchable: true,
      hide: false,
      valueType: 'link',
      valuePrepareFunction: (row) => {
        return row.fileName;
      },
    },
    {
      name: 'emerNumber',
      displayName: 'EmerNumber',
      isSearchable: true,
      hide: false,
      type: 'text',
    },
    {
      name: 'category',
      displayName: 'Category',
      isSearchable: true,
      hide: false,
      type: 'text',
    },
    {
      name: 'subject',
      displayName: 'Subject',
      isSearchable: true,
      hide: false,
      type: 'text',
    },
  ];
}
