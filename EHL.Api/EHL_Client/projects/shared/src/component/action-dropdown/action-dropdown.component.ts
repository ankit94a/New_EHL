import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SharedLibraryModule } from '../../shared-library.module';


@Component({
  selector: 'action-dropdown',
  templateUrl: './action-dropdown.component.html',
  standalone:true,
  imports: [SharedLibraryModule],
})
export class ActionDropdownComponent implements OnInit {

  @Input() sessionId: number;
  // @Input() notifType: NotifType;
  @Output() afterClosed: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor( public dialog: MatDialog) { }

  ngOnInit() {
  }

  download(isSample) {
    // let downloadModel = new DownloadModel();
    // downloadModel.NotifType = this.notifType;
    // downloadModel.sessionId = this.sessionId;
    // downloadModel.IsSample = isSample;
    // this.downloadService.download(downloadModel);
  }

  import() {
    // let uploadModel = new UploadModel();
    // uploadModel.NotifType =this.notifType;
    // uploadModel.sessionId = this.sessionId;
    // const dialogConfig = new MatDialogConfig();
    // dialogConfig.data = uploadModel;
    // const dialogRef = this.dialog.open(FileUploadComponent, dialogConfig);
    // dialogRef.afterClosed().subscribe(
    //   data => {
    //     if (data) {
    //       this.afterClosed.emit(data);
    //     }
    //   }
    // );
  }
}
