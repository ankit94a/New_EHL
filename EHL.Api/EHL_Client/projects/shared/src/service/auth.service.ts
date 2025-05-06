import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private wingSubject = new BehaviorSubject<string | null>(null);
  wing$ = this.wingSubject.asObservable();
  constructor(private router:Router) { }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('EHL_TOKEN');
    return token ? true : false;
  }
  setUserDetails(user){
    localStorage.setItem("EHL_RoleType",user.roleType);
    localStorage.setItem("EHL_UserName",user.userName);
    localStorage.setItem("EHL_RoleId",user.roleId);
  }
  setToken(token:string){
    localStorage.setItem("EHL_TOKEN",token);
  }

  getToken(){
    return localStorage.getItem("EHL_TOKEN");
  }
  getUserName(){
    return localStorage.getItem("EHL_UserName");
  }
  getRoleType(){
    return localStorage.getItem("EHL_RoleType");
  }
  getRoleId(){
    return localStorage.getItem("EHL_RoleId");
  }
  clear() {
    localStorage.removeItem('EHL_TOKEN');
    localStorage.removeItem('EHL_RoleType');
    localStorage.removeItem('EHL_UserName');
    this.navigateToLogin(this.router.routerState.snapshot.url);

  }
  public navigateToLogin(stateUrl) {
    this.router.navigate(['/landing'], { queryParams: { 1: { returnUrl: stateUrl } } });
  }
  setWingDetails(wing){
    localStorage.setItem("Wing_Name",wing.name);
    this.wingSubject.next(wing.name);
    localStorage.setItem("Wing_Id",wing.id);
  }
  getWingName(){
    if(localStorage.getItem("Wing_Name"))
      this.wingSubject.next(localStorage.getItem("Wing_Name"))
    return this.wingSubject.getValue();
  }
  getWingId(){
    return localStorage.getItem("Wing_Id");
  }
  clearWing() {
    this.wingSubject.next(null);
    localStorage.removeItem("Wing_Name");
    localStorage.removeItem("Wing_Id");
  }

}
