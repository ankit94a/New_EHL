import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import * as FullStory from '@fullstory/browser';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'projects/shared/src/enviroments/environments.development';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'admin';
  constructor(public translate: TranslateService){
    FullStory.init({
      orgId: 'TMT7D',
      devMode: !environment.production
    });
    translate.setDefaultLang('en');
    translate.defaultLang = 'en';
  }
}
