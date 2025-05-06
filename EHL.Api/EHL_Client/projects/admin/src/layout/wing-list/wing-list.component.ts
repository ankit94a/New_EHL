import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Wing } from 'projects/shared/src/models/attribute.model';
import { ApiService } from 'projects/shared/src/service/api.service';
import { AuthService } from 'projects/shared/src/service/auth.service';
import { SharedLibraryModule } from 'projects/shared/src/shared-library.module';

@Component({
  selector: 'app-wing-list',
  standalone: true,
  imports: [SharedLibraryModule],
  templateUrl: './wing-list.component.html',
  styleUrl: './wing-list.component.scss'
})
export class WingListComponent {
  wingList:Wing[]=[];
  roleType;
  constructor(private apiService:ApiService,private authService:AuthService,private router: Router){
    this.getWingList();
    this.roleType = this.authService.getRoleType();
  }

  getWingList(){
    this.apiService.getWithHeaders('attribute/wing').subscribe(res =>{
      if(res){
        this.wingList = res;
        this.wingList[0].imageUrl = 'automotive.jpg';
        this.wingList[1].imageUrl = 'elect.jpg';
        this.wingList[2].imageUrl = 'mechnery.jpg';
        this.wingList[3].imageUrl = 'avi.jpg';
        this.wingList[4].imageUrl = 'misc2.jpg';
      }
    })
  }
  setWingData(wing){
    this.authService.setWingDetails(wing);
    if(this.roleType == '2' || this.roleType == '3'){
      this.router.navigate(['/emer']);
    }else{
      this.router.navigate(['/dashboard']);
    }

  }
}
