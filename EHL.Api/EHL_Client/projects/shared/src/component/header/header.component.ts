import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SharedLibraryModule } from '../../shared-library.module';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { LanguageComponent } from '../language/language.component';
import { UserProfileComponent } from 'projects/admin/src/layout/user-profile/user-profile.component';
import { BISMatDialogService } from '../../service/insync-mat-dialog.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone:true,
  imports:[SharedLibraryModule,RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  wing$: Observable<string | null>;
  @Output() toggleSideBarForMe: EventEmitter<any> = new EventEmitter();

  constructor(private authService:AuthService,private dialogService:BISMatDialogService) {
    this.wing$ = this.authService.wing$;
  }

  ngOnInit(): void {

  }

  toggleSideBar() {
    this.toggleSideBarForMe.emit();
    setTimeout(() => {
      window.dispatchEvent(
        new Event('resize')
      );
    }, 300);
  }
  removeWing() {
    this.authService.clearWing();
  }

  onLoggedout() {
    this.authService.clear()
    this.authService.clearWing();
  }
  openDialog(){
    this.dialogService.open(UserProfileComponent,null,'75vw','75vh')
  }
}
