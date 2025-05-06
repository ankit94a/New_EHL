import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  constructor() { }

  public setLanguage(lang: string){
    localStorage.setItem('EHL_Language', lang);
  }
  public getLanguage(){
    let lang= localStorage.getItem('EHL_Language');

    if(lang==undefined || lang===null){
      lang='en';
    }
    return lang;
  }
}
