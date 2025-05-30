import { Component, effect, EventEmitter, inject, OnInit, Output, signal } from '@angular/core';
import { SharedLibraryModule } from '../../shared-library.module';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { LanguageComponent } from '../language/language.component';
import { UserProfileComponent } from 'projects/admin/src/layout/user-profile/user-profile.component';
import { BISMatDialogService } from '../../service/insync-mat-dialog.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserIdleService } from '../../service/user-idol.service';
import { TimerPipe } from '../pipes/timer.pipe';
import { ApiService } from '../../service/api.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [SharedLibraryModule, RouterModule, TimerPipe],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  wing$: Observable<string | null>; private userIdleService = inject(UserIdleService); // ✅ inject the service here
  timer$ = signal(15 * 60); // 15 minutes countdown
  @Output() toggleSideBarForMe: EventEmitter<any> = new EventEmitter();

  constructor(private authService: AuthService, private dialogService: BISMatDialogService, private apiService: ApiService) {
    this.wing$ = this.authService.wing$;
    this.setupUserIdleTracking();
  }

  ngOnInit(): void {

  }
  setupUserIdleTracking() {
    // Reset on any activity
    this.userIdleService.onUserActivity(() => {
      this.timer$.set(15 * 60); // reset timer to 15 min
    });

    // Countdown logic
    effect(() => {
      const interval = setInterval(() => {
        const current = this.timer$();
        if (current > 0) {
          this.timer$.set(current - 1);
        } else {
          clearInterval(interval);
          this.onLoggedout(); // when timer hits 0
        }
      }, 1000);
    });
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
    this.apiService.getWithHeaders('auth/logout').subscribe(res => {
      debugger
      if (res) {
        this.authService.clear()
        this.authService.clearWing();
      }
    })

  }
  openDialog() {
    this.dialogService.open(UserProfileComponent, null, '75vw', '75vh')
  }
}