import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../service/auth.service';

@Injectable({ providedIn: 'root' })

export class AuthGuard  {
  constructor(private helper: AuthService,public router : Router ) { }
  canActivate(
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    const isLoggedIn = this.helper.isAuthenticated();
    if (isLoggedIn) return true;
    else {
      this.router.navigate(['/landing'], { queryParams: { returnUrl: state.url } });
      return false;
    }
  }
}

