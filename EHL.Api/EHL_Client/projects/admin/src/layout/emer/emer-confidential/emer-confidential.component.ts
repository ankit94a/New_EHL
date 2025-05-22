import { AuthService } from 'projects/shared/src/service/auth.service';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { EcrTokenComponent } from 'projects/shared/src/component/ecr-token/ecr-token.component';

@Component({
  selector: 'app-emer-confidential',
  standalone: true,
  imports: [CommonModule,EcrTokenComponent ],
  templateUrl: './emer-confidential.component.html',
  styleUrl: './emer-confidential.component.scss'
})
export class EmerConfidentialComponent {
isOfficerLoggedIn:boolean=false;
userType;

constructor(private authService :AuthService){
  this.userType = this.authService.getRoleType();
  debugger
  if(this.userType == '1'){
    this.isOfficerLoggedIn = true;
  }
}
}
