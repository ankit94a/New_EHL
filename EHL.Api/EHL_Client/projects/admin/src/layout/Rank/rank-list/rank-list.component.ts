import { Component } from '@angular/core';
import { BISMatDialogService } from 'projects/shared/src/service/insync-mat-dialog.service';
import { SharedLibraryModule } from 'projects/shared/src/shared-library.module';
import { RankAddComponent } from '../rank-add/rank-add.component';
import { ActionDropdownComponent } from 'projects/shared/src/component/action-dropdown/action-dropdown.component';

@Component({
  selector: 'app-rank-list',
  standalone: true,
  imports: [SharedLibraryModule,ActionDropdownComponent],
  templateUrl: './rank-list.component.html',
  styleUrl: './rank-list.component.scss'
})
export class RankListComponent {

  constructor(private dialogService:BISMatDialogService){

  }
  add(){
    this.dialogService.open(RankAddComponent,null)
  }
}
