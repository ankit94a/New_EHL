import { Component } from '@angular/core';
import { TablePaginationSettingsConfig } from 'projects/shared/src/component/zipper-table/table-settings.model';
import { ZipperTableComponent } from 'projects/shared/src/component/zipper-table/zipper-table.component';
import {
  Policy,
  PolicyFilterModel,
} from 'projects/shared/src/models/policy&misc.model';
import { ApiService } from 'projects/shared/src/service/api.service';
import { AuthService } from 'projects/shared/src/service/auth.service';
import { SharedLibraryModule } from 'projects/shared/src/shared-library.module';
import { PolicyAddComponent } from './../policy-add/policy-add.component';
import { BISMatDialogService } from 'projects/shared/src/service/insync-mat-dialog.service';
import { ToastrService } from 'ngx-toastr';
import { DeleteModel } from 'projects/shared/src/models/attribute.model';
import { DownloadModel } from 'projects/shared/src/models/download.model';
import { DownloadFileType } from 'projects/shared/src/models/enum.model';
import { DownloadService } from 'projects/shared/src/service/download.service';
import { EncryptionService } from 'projects/shared/src/service/encryption.service';

@Component({
  selector: 'app-policy-sidebar',
  standalone: true,
  imports: [SharedLibraryModule, ZipperTableComponent],
  templateUrl: './policies.component.html',
  styleUrl: './policies.component.scss',
})
export class PoliciesComponent extends TablePaginationSettingsConfig {
  defectReports: Policy[] = [];
  filterModel: Policy = new Policy();
  isRefresh: boolean = false;
  userType;
  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private dialogService: BISMatDialogService,
    private toastr: ToastrService,private downloadService:DownloadService,
    private EncryptionService: EncryptionService,
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
    this.filterModel.wingId = parseInt(this.authService.getWingId());
    this.filterModel.type = 'Policy Compendium';
    this.getPolicyByWing();
  }
  openDailog() {
    this.dialogService.open(PolicyAddComponent, null, '50vw').then((res) => {
      if (res) {
        this.getPolicyByWing();
      }
    })
  }
  getFileId($event) {
        var download = new DownloadModel();
        download.filePath = $event.filePath;
        download.name = $event.fileName;
        download.fileType = DownloadFileType.Policy;
        this.downloadService.download(download)
    }
  getPolicyByWing() {
    this.apiService
      .getWithHeaders('policy/policies')
      .subscribe(async(res) => {
        if (res) {
          this.defectReports = await this.EncryptionService.decryptResponseList(res);
        }
      });
  }
   edit(row) {
      row.isEdit = true;
      this.dialogService.open(PolicyAddComponent, row).then((res) => {
        if (res) {
          this.getPolicyByWing();
        }
      });
    }


  delete(row) {
    let policyModel: DeleteModel = new DeleteModel();
    policyModel.Id = row.item.id;
    policyModel.TableName = 'policy';

    this.dialogService
      .confirmDialog('Are you sure you want to delete this policy?')
      .subscribe((res) => {
        if (res) {
          this.apiService
            .postWithHeader(`attribute/delete`, policyModel)
            .subscribe({
              next: (res) => {
                this.getPolicyByWing();
                this.toastr.success('Deleted Successfully', 'Success');
              },
              error: (err) => {
                this.toastr.error('Failed to Delete', 'Error');
                console.error(err);
              },
            });
        }
      });
  }

  columns = [
    {
      name: 'fileName',
      displayName: 'File Name',
      isSearchable: true,
      hide: false,
      valueType: 'link',
      valuePrepareFunction: (row) => {
        return row.fileName;
      },
    },
    {
      name: 'category',
      displayName: 'Category',
      isSearchable: true,
      hide: false,
      type: 'text',
    },
    {
      name: 'subCategory',
      displayName: 'Sub Category',
      isSearchable: true,
      hide: false,
      type: 'text',
    },
    {
      name: 'eqpt',
      displayName: 'eqpt',
      isSearchable: true,
      hide: false,
      type: 'text',
    },
    {
      name: 'remarks',
      displayName: 'Remarks',
      isSearchable: true,
      hide: false,
      type: 'text',
    },
  ];
}
