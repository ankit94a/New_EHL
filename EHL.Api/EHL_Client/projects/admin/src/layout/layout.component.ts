import { Component } from '@angular/core';
import { SharedLibraryModule } from '../../../shared/src/shared-library.module';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { HeaderComponent } from '../../../shared/src/component/header/header.component';
import { SidebarComponent } from '../../../shared/src/component/sidebar/sidebar.component';
import { FooterComponent } from '../../../shared/src/component/footer/footer.component';
import { ChatBotComponent } from 'projects/shared/src/component/chat-bot/chat-bot.component';
import { BISMatDialogService } from 'projects/shared/src/service/insync-mat-dialog.service';
// import { SharedLibraryModule } from '../../../sharedlibrary/src/shared-library.module';
// import { RouterModule } from '@angular/router';
// import { HeaderComponent } from '../../../sharedlibrary/src/component/header/header.component';
// import { SidebarComponent } from '../../../sharedlibrary/src/component/sidebar/sidebar.component';
// import { FooterComponent } from 'projects/sharedlibrary/src/component/footer/footer.component';


@Component({
  selector: 'app-layout',
  standalone:true,
  imports: [SharedLibraryModule,RouterModule,HeaderComponent,SidebarComponent,FooterComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {

  sideBarOpen = true;
  isSideBarLoaded:boolean=false;
  typeSelected;
  isMinimized: boolean = false;
  constructor(private router:Router,private dialogService:BISMatDialogService) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.sideBarOpen = !(event.url === '/wing' || event.url === '/master-sheet');
      }
    });

    this.typeSelected= 'ball-fussion';
  }

  ngOnInit(): void {

  }
   chatbox() {
  const dialogRef = this.dialogService.openDialogForChatBox(ChatBotComponent, {
  });
}

  changeClass() {
    this.isMinimized = !this.isMinimized;
  }

  isLoaded($event:any){
    this.isSideBarLoaded = $event
  }
  sideBarToggler() {
    this.sideBarOpen = !this.sideBarOpen;
  }
}
