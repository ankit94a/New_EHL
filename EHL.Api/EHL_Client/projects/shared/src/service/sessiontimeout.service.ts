// session-timeout.service.ts
import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SessionTimeoutService {
  private inactivityTimer: any;
  private countdownTimer: any;
  private timeoutPeriod = 10 * 60 * 1000; // 10 minutes in milliseconds
  private countdownSubject = new Subject<number>();
  private logoutSubject = new Subject<void>();

  constructor(
    private router: Router,
    private http: HttpClient,
    private ngZone: NgZone
  ) {
    this.setupActivityListeners();
    this.resetInactivityTimer();
  }

  // Observable for countdown updates
  get countdown$(): Observable<number> {
    return this.countdownSubject.asObservable();
  }

  // Observable for logout events
  get onLogout$(): Observable<void> {
    return this.logoutSubject.asObservable();
  }

  private setupActivityListeners(): void {
    // Listen for user activity events
    window.addEventListener('mousemove', this.resetInactivityTimer.bind(this));
    window.addEventListener('keypress', this.resetInactivityTimer.bind(this));
    window.addEventListener('scroll', this.resetInactivityTimer.bind(this));
    window.addEventListener('click', this.resetInactivityTimer.bind(this));
    window.addEventListener('touchstart', this.resetInactivityTimer.bind(this));
  }

  resetInactivityTimer(): void {
    // Clear existing timers
    clearTimeout(this.inactivityTimer);
    clearInterval(this.countdownTimer);

    // Start new inactivity timer
    this.inactivityTimer = setTimeout(() => {
      this.startLogoutCountdown();
    }, this.timeoutPeriod - 5000); // Start countdown 5 seconds before actual timeout
  }

  private startLogoutCountdown(): void {
    let countdown = 5; // 5 seconds countdown

    this.countdownTimer = setInterval(() => {
      this.ngZone.run(() => {
        this.countdownSubject.next(countdown);

        if (countdown <= 0) {
          clearInterval(this.countdownTimer);
          this.performLogout();
        }

        countdown--;
      });
    }, 1000);
  }

  private performLogout(): void {
    // Call your API logout endpoint
    this.http.post('/api/logout', {}).subscribe({
      next: () => {
        this.logoutSubject.next();
        this.router.navigate(['/login']);
        // Clear any stored tokens or user data
        localStorage.removeItem('access_token');
        sessionStorage.clear();
      },
      error: () => {
        // Even if API call fails, proceed with client-side logout
        this.logoutSubject.next();
        this.router.navigate(['/login']);
        localStorage.removeItem('access_token');
        sessionStorage.clear();
      }
    });
  }

  destroy(): void {
    // Clean up listeners and timers
    clearTimeout(this.inactivityTimer);
    clearInterval(this.countdownTimer);
    window.removeEventListener('mousemove', this.resetInactivityTimer.bind(this));
    window.removeEventListener('keypress', this.resetInactivityTimer.bind(this));
    window.removeEventListener('scroll', this.resetInactivityTimer.bind(this));
    window.removeEventListener('click', this.resetInactivityTimer.bind(this));
    window.removeEventListener('touchstart', this.resetInactivityTimer.bind(this));
  }
}
