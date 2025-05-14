import { BISMatDialogService } from 'projects/shared/src/service/insync-mat-dialog.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { ApiService } from 'projects/shared/src/service/api.service';
import { SharedLibraryModule } from 'projects/shared/src/shared-library.module';
import { catchError, map, Observable } from 'rxjs';
import { LoginComponent } from '../../../login/login.component';
import { ActivatedRoute } from '@angular/router';
import { LandingProfile, News } from 'projects/shared/src/models/news.model';
import { Policy } from 'projects/shared/src/models/policy&misc.model';
import { IpService } from 'projects/shared/src/service/ip.service';
import { AuthService } from 'projects/shared/src/service/auth.service';
import { DownloadModel } from 'projects/shared/src/models/download.model';
import { DownloadFileType } from 'projects/shared/src/models/enum.model';
import { DownloadService } from 'projects/shared/src/service/download.service';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [SharedLibraryModule,],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss'
})
export class LandingPageComponent {

 news: News;
  newsList: News[] = [];
   userProfile: LandingProfile = new LandingProfile();
  latestEmer = [];
  latestTechnicalReference:Policy[]=[];
  ipAddress:string='';

  constructor(private downloadService:DownloadService,private authService:AuthService, private apiService:ApiService,private http:HttpClient,private dialogService: BISMatDialogService,private route:ActivatedRoute,private ipService:IpService){
    this.news = new News();
    this.newsList = [];

  }
  ngOnInit() {
    this.getAllNews();
    this.getProfile();
    this.getLatestPolicy();
    this.getLatestEmer();
    this.ipService.getIpAddress().subscribe((res) => {
      this.ipAddress = res.ip;
    });
  }
  getLatestEmer(){
    this.apiService.getWithHeaders('emer/latest/emer').subscribe(res => {
      if (res) {
        this.latestEmer = res;
      }
    })
  }
  getLatestPolicy(){
    this.apiService.getWithHeaders('emer/latest/policy').subscribe(res => {
      if (res) {
        this.latestTechnicalReference = res;
      }
    })
  }
  getAllNews() {
    this.apiService.getWithHeaders('landingpage/news').subscribe(res => {
      if (res) {
        this.newsList = res;
      }
    })
  }
  getProfile(){
    this.apiService.getWithHeaders('landingpage/profile').subscribe(res =>{
      if(res){
        this.userProfile = res;
      }
    })
  }
  openDialog(){
    this.dialogService.open(LoginComponent,null,'30vw','42vh');
  }
getFileId($event,type) {

      var download = new DownloadModel();
      download.filePath = $event.filePath;
      download.name = $event.fileName;
      if(type == 'emer'){
        download.fileType = DownloadFileType.Emer;
      }else{
        download.fileType = DownloadFileType.Policy;
      }
      this.downloadService.download(download)
    }


}
