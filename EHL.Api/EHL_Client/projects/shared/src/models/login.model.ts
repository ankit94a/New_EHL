import { BaseModel } from "./base.model";
import { PermissionAction, PermissionItem } from "./enum.model";

export class LoginModel extends BaseModel{
  userName:string;
  password:string;
}
export class PermissionToVerify extends BaseModel {
  permissionName: PermissionItem;
  permissionAction: PermissionAction;
}
export class Role extends BaseModel {
  roleName: string;
  roleType:string;
  description: string;
  permissions: Permission[];
  isView: boolean;
}
export class Permission {
  permissionItem: PermissionItem;
  permissionAction: PermissionAction[];
}
