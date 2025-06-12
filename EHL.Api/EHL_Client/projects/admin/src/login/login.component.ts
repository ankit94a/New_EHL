import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LoginModel } from 'projects/shared/src/models/login.model';
import { ApiService } from 'projects/shared/src/service/api.service';
import { AuthService } from 'projects/shared/src/service/auth.service';
import { BISMatDialogService } from 'projects/shared/src/service/insync-mat-dialog.service';
import { LanguageService } from 'projects/shared/src/service/language.service';
import { SharedLibraryModule } from 'projects/shared/src/shared-library.module';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [SharedLibraryModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginform: FormGroup;
  showPassword = false;
  constructor(private fb: FormBuilder,private apiService:ApiService,private authService:AuthService,private router: Router,private dialog : MatDialog){
    this.loginform = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

 doLogin() {
  if (this.loginform.invalid) {
    return;
  }
  // 

  this.apiService.postWithHeader('auth/login', this.loginform.value).subscribe({
    
    next: (res) => {
    
      if (res) {
        this.authService.setRoleType('1');
        this.authService.setToken(res.token);
        this.dialog.closeAll();
        this.router.navigate(['/wing']);
      } else {
        this.router.navigate(['/landing']);
      }
    },
    error: (err) => {
      debugger
      console.error('Login failed:', err);
      this.router.navigate(['/landing']);
    }
  });
}

  getUserRole(){
    this.apiService.getWithHeaders('auth/role/type').subscribe(res =>{

      if(res){
        this.authService.setRoleType(res)
      }
    })
  }
}
