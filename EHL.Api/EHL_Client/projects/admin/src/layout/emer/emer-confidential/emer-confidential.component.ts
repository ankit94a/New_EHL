
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SharedLibraryModule } from 'projects/shared/src/shared-library.module';
@Component({
  selector: 'app-emer-confidential',
  standalone: true,
  imports: [CommonModule,SharedLibraryModule],
  templateUrl: './emer-confidential.component.html',
  styleUrl: './emer-confidential.component.scss'
})
export class EmerConfidentialComponent {

  isOfficerLoggedIn:boolean = false;

}
