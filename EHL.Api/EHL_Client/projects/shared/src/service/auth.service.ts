import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private wingSubject = new BehaviorSubject<string | null>(null);
  wing$ = this.wingSubject.asObservable();
  private wingIdSubject = new BehaviorSubject<string | null>(null);
  wingId$ = this.wingSubject.asObservable();
  private userRoleSubject = new BehaviorSubject<string | null>(null);
  roleType$ = this.userRoleSubject.asObservable();
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
  getRoleId(){
    return localStorage.getItem("EHL_RoleId");
  }
  clear() {
    this.navigateToLogin(this.router.routerState.snapshot.url);

  }
  public navigateToLogin(stateUrl) {
    this.router.navigate(['/landing'], { queryParams: { 1: { returnUrl: stateUrl } } });
  }
  setWingDetails(wing){
    this.wingSubject.next(wing.name);
    this.wingIdSubject.next(wing.id);
  }
  setRoleType(role){
    this.userRoleSubject.next(role);
  }
  getRoleType(){
    return this.userRoleSubject.getValue();
  }
  getWingName(){
    return this.wingSubject.getValue();
  }
  getWingId(){
    return this.wingIdSubject.getValue();
  }
  clearWing() {
    this.wingSubject.next(null);
    localStorage.removeItem("Wing_Name");
    localStorage.removeItem("Wing_Id");
  }

}
