import { Injectable, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from './api.service';
import { PermissionToVerify, Role } from '../models/login.model';


@Injectable({
  providedIn: 'root'
})
export class ValidatepermissionService {
  @Input()
  role: Role;
  currentUrl:string
  private _permissionList = new BehaviorSubject<PermissionToVerify[]>([]);
  public permissionList$ = this._permissionList.asObservable();
  constructor(private apiService: ApiService)
  {
  }
  async init(): Promise<any> {
    this.getRolePermission();
  }

  getRolePermission() {
    this.apiService.getWithHeaders('auth/rolepermission').subscribe((res) => {
      this._permissionList.next(res);
    });
  }

  hasPermission(permissionName: any, permissionAction: any) {
    let permissions=[];
    this.permissionList$.subscribe(data=>{
      permissions=data
    });
    if(permissions && permissions.length>0 &&  permissions.find(permission => {
      return (permission.permissionName === permissionName && permission.permissionAction == permissionAction && permission.isActive == true)
    })){
      return true;
    };
    return false;
  }
}
