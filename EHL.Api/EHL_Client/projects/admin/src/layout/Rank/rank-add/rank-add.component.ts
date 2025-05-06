import { Component } from '@angular/core';
import { SharedLibraryModule } from 'projects/shared/src/shared-library.module';

@Component({
  selector: 'app-rank-add',
  standalone: true,
  imports: [SharedLibraryModule],
  templateUrl: './rank-add.component.html',
  styleUrl: './rank-add.component.scss'
})
export class RankAddComponent {
  isActive=['True','False']
}
