import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LoginModel } from 'projects/shared/src/models/login.model';
import { ApiService } from 'projects/shared/src/service/api.service';
import { AuthService } from 'projects/shared/src/service/auth.service';
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
  constructor(private fb: FormBuilder,private apiService:ApiService,private authService:AuthService,private router: Router,private dialog:MatDialog,private languageService:LanguageService){
    this.loginform = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  doLogin(){
    if (this.loginform.invalid) {
      return;
    }
    this.apiService.postWithHeader('auth/login',this.loginform.value).subscribe(res =>{
      if(res && res.token){
        this.authService.setToken(res.token)
        this.authService.setUserDetails(res.user)
        this.dialog.closeAll();
        // this.languageService.setLanguage('en')
        this.router.navigate(['/wing']);
      }else {
        this.router.navigate(['/landing']);
      }
    })
  }
}
