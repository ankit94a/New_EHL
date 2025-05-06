import { Component } from '@angular/core';
import { SharedLibraryModule } from 'projects/shared/src/shared-library.module';
@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [SharedLibraryModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent {
  user = {
    name: '',
    army: '',
    unit:'',
    rank:'',
    remarks:'',
    text: '',
  }

  // constructor(){
  // }

  call(){
    this.user
  }
  // close() {
  //   this.dialogRef.close(true);
  // }
  // reset() {
  //   this.createForm();
  // }
}
