import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SharedLibraryModule } from '../../shared-library.module';
import { LanguageService } from '../../service/language.service';
import { EnumBase } from '../../models/enum.model';
import { EnumListPipe } from '../pipes/enum-list.pipe';

@Component({
  selector: 'app-language',
  standalone: true,
  imports: [SharedLibraryModule,EnumListPipe],
  templateUrl: './language.component.html',
  styleUrl: './language.component.css',
  // providers:[EnumListPipe]
})
export class LanguageComponent extends EnumBase{
  defaultLang;
  constructor(public translate:TranslateService,private languageService:LanguageService) {
    super();
   }

  ngOnInit(): void {
   this.defaultLang = this.languageService.getLanguage();
   this.switchLang(this.defaultLang);
  }
  switchLang(lang: string) {
    this.translate.use(lang);
  }
}
