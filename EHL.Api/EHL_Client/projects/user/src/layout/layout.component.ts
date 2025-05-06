import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { FooterComponent } from 'projects/shared/src/component/footer/footer.component';
import { HeaderComponent } from 'projects/shared/src/component/header/header.component';
import { SidebarComponent } from 'projects/shared/src/component/sidebar/sidebar.component';
import { SharedLibraryModule } from 'projects/shared/src/shared-library.module';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [SharedLibraryModule,RouterModule,HeaderComponent,SidebarComponent,FooterComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {
  sideBarOpen = true;
  isSideBarLoaded:boolean=false;
  typeSelected;
  constructor() {

    this.typeSelected= 'ball-fussion';
  }

  ngOnInit(): void {

  }
  isLoaded($event:any){
    this.isSideBarLoaded = $event
  }
  sideBarToggler() {
    this.sideBarOpen = !this.sideBarOpen;
  }
}

