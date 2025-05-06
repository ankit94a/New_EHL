import { Component, OnInit, TemplateRef, ViewChild, viewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { LandingCarousel, LandingProfile, News } from 'projects/shared/src/models/news.model';
import { ApiService } from 'projects/shared/src/service/api.service';
import { BISMatDialogService } from 'projects/shared/src/service/insync-mat-dialog.service';
import { SharedLibraryModule } from 'projects/shared/src/shared-library.module';

@Component({
  selector: 'app-landing-page-update',
  standalone: true,
  imports: [SharedLibraryModule],
  templateUrl: './landing-page-update.component.html',
  styleUrl: './landing-page-update.component.scss'
})
export class LandingPageUpdateComponent implements OnInit {
  @ViewChild('AddNews') newsTemplate: TemplateRef<any>;
  @ViewChild('updateProfile') updateProfile: TemplateRef<any>
  @ViewChild('updateCarousel') updateCarousel: TemplateRef<any>
  news: News;
  newsList: News[] = [];
  profile: LandingProfile = new LandingProfile();
  userProfile: LandingProfile = new LandingProfile();
  carousel:LandingCarousel = new LandingCarousel();

  constructor(private dialogService: BISMatDialogService, private apiService: ApiService, private toastr: ToastrService, private dialog: MatDialog) {
    this.news = new News();
    this.newsList = [];
  }

  ngOnInit() {
    this.getAllNews();
    this.getProfile();
  }

  getProfile(){
    this.apiService.getWithHeaders('landingpage/profile').subscribe(res =>{
      if(res){
        this.userProfile = res;
      }
    })
  }
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.profile.profile = reader.result as string;
      };
    }
  }
  onCarouselSelected(event: any): void {
    const files = event.target.files;
    if (files && files.length > 0) {
      // Convert files to base64 or image URLs
      const imageUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const reader = new FileReader();
        reader.onload = () => {
          imageUrls.push(reader.result as string); // Add base64 data to the array
          this.carousel.images = imageUrls;
        };
        reader.readAsDataURL(files[i]);
      }
    }
  }
  removeImage(): void {
    this.profile.profile = '';
  }
  getAllNews() {
    this.apiService.getWithHeaders('landingpage/news').subscribe(res => {
      if (res) {
        this.newsList = res;
      }
    })
  }
  addNews() {
    this.dialogService.open(this.newsTemplate, null, '40vw')
  }
  saveNews() {
    this.apiService.postWithHeader('landingpage/news', this.news).subscribe(res => {
      if (res) {
        this.dialog.closeAll();
        this.toastr.success("News added successfully", 'success');
        this.getAllNews();
      }
    })
  }

  openDialog() {
   this.profile = new LandingProfile();
    this.dialogService.open(this.updateProfile, null, '30vw')
  }
  update() {
    this.apiService.postWithHeader('landingpage/profile', this.profile).subscribe(res => {
      if (res) {
        this.dialog.closeAll();
        this.toastr.success("Profile updated successfully", 'success');
        this.getProfile();
      }
    })
  }

  openCarousel(){
    this.dialogService.open(this.updateCarousel,null,'40vw');
  }
  updateBanner(){
    this.apiService.postWithHeader('landingpage/carousel',this.carousel).subscribe(res => {
      if(res){
        this.toastr.success("Banner image updated",'success');
      }
    })
  }
}
