import { Component } from '@angular/core';
import { TablePaginationSettingsConfig } from 'projects/shared/src/component/zipper-table/table-settings.model';
import { ZipperTableComponent } from 'projects/shared/src/component/zipper-table/zipper-table.component';
import { TechnicalAoAi } from 'projects/shared/src/models/technicalAoAi.model';
import { ApiService } from 'projects/shared/src/service/api.service';
import { AuthService } from 'projects/shared/src/service/auth.service';
import { SharedLibraryModule } from 'projects/shared/src/shared-library.module';
import { AddTechnicalAoAiComponent } from '../techincal-ao-ai/add-technical-ao-ai/add-technical-ao-ai.component';
import { BISMatDialogService } from 'projects/shared/src/service/insync-mat-dialog.service';
import { ToastrService } from 'ngx-toastr';
import { DeleteModel } from 'projects/shared/src/models/attribute.model';

@Component({
  selector: 'app-techincal-ao-ai',
  standalone: true,
  imports: [SharedLibraryModule, ZipperTableComponent],
  templateUrl: './techincal-ao-ai.component.html',
  styleUrl: './techincal-ao-ai.component.scss',
})
export class TechincalAoAiComponent extends TablePaginationSettingsConfig {
  TechnicalAoAi: TechnicalAoAi[] = [];
  filterModel: TechnicalAoAi = new TechnicalAoAi();
  isRefresh: boolean = false;
  userType;
  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private dialogService: BISMatDialogService,
    private toastr: ToastrService
  ) {
    super();
    this.userType = this.authService.getRoleType();
    this.tablePaginationSettings.enableAction = true;
    if (this.userType != '2') {
      this.tablePaginationSettings.enableEdit = true;
      // this.tablePaginationSettings.enableView = true;
      this.tablePaginationSettings.enableDelete = true;
    }

    this.tablePaginationSettings.enableColumn = true;
    this.tablePaginationSettings.pageSizeOptions = [50, 100];
    this.tablePaginationSettings.showFirstLastButtons = false;
    // this.filterModel.type = 'TechnicalAoAi Compendium'
    this.getTechnicalAoAi();
  }
  openDailog() {
    this.dialogService
      .open(AddTechnicalAoAiComponent, null, '50vw')
      .then((res) => {
        if (res) {
          this.getTechnicalAoAi();
          this.toastr.success('Added Successfully', 'Success');
        }
      });
  }

  getTechnicalAoAi() {
    this.apiService.getWithHeaders('TechnicalAoAi').subscribe((res) => {
      if (res) {
        this.TechnicalAoAi = res;
      }
    });
  }

  edit(row) {
    row.isEdit = true;
    this.dialogService.open(AddTechnicalAoAiComponent, row).then((res) => {
      if (res) {
        this.getTechnicalAoAi();

      }
    });
  }
  delete(row) {
    let deleteTechnicalAoAi: DeleteModel = new DeleteModel();
    deleteTechnicalAoAi.Id = row.item.id;
    deleteTechnicalAoAi.TableName = 'TechnicalAoAi';

    this.dialogService
      .confirmDialog('Are you sure to delete TechnicalAoAi?')
      .subscribe((res) => {
        if (res) {
          this.apiService
            .postWithHeader(`attribute/delete`, deleteTechnicalAoAi)
            .subscribe({
              next: (res) => {
                this.getTechnicalAoAi();
                this.toastr.success('Deleted Successfully', 'Success');
                // this.dailogRef?.close(true);
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
      name: 'subject',
      displayName: 'Subject',
      isSearchable: true,
      hide: false,
      type: 'text',
    },
    {
      name: 'reference',
      displayName: 'Reference',
      isSearchable: true,
      hide: false,
      type: 'text',
    },
    {
      name: 'type',
      displayName: 'Type',
      isSearchable: true,
      hide: false,
      type: 'text',
    },
  ];
}
