import { AfterViewInit, Component } from '@angular/core';
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
  standalone: true,
  imports: [SharedLibraryModule, RouterModule, HeaderComponent, SidebarComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {

  sideBarOpen = true;
  isSideBarLoaded: boolean = false;
  typeSelected;
  isMinimized: boolean = false;
  position = { x: 1500, y: 650 };
  isDragging = false;
  offset = { x: 0, y: 0 };


  constructor(private router: Router, private dialogService: BISMatDialogService) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.sideBarOpen = !(event.url === '/wing' || event.url === '/master-sheet' || event.url === '/policy' || event.url === '/role-of-mag');
      }
    });
    this.setDynamicPosition();
    this.typeSelected = 'ball-fussion';
  }
  setDynamicPosition() {
    const offsetX = 170;
    const offsetY = 170;

    this.position = {
      x: window.innerWidth - offsetX,
      y: window.innerHeight - offsetY
    };
  }
  chatbox() {
    const dialogRef = this.dialogService.openDialogForChatBox(ChatBotComponent, {
    });
  }

  changeClass() {
    this.isMinimized = !this.isMinimized;
  }

  isLoaded($event: any) {
    this.isSideBarLoaded = $event
  }
  sideBarToggler() {
    this.sideBarOpen = !this.sideBarOpen;
  }

  startDrag(event: MouseEvent): void {
    this.isDragging = true;
    this.offset.x = event.clientX - this.position.x;
    this.offset.y = event.clientY - this.position.y;

    document.addEventListener('mousemove', this.onDragBound);
    document.addEventListener('mouseup', this.stopDragBound);

    event.preventDefault();
  }

  onDrag = (event: MouseEvent): void => {
    if (this.isDragging) {
      const newX = event.clientX - this.offset.x;
      const newY = event.clientY - this.offset.y;

      // Limit drag within viewport
      this.position.x = Math.max(0, Math.min(newX, window.innerWidth - 60));
      this.position.y = Math.max(0, Math.min(newY, window.innerHeight - 60));
    }
  };
  stopDrag = (): void => {
    this.isDragging = false;
    localStorage.setItem('avatarPosition', JSON.stringify(this.position));
    document.removeEventListener('mousemove', this.onDragBound);
    document.removeEventListener('mouseup', this.stopDragBound);
  };
  onDragBound = this.onDrag.bind(this);
  stopDragBound = this.stopDrag.bind(this);
}
