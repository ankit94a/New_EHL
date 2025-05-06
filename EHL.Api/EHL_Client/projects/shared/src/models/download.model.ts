import { BaseModel } from "./base.model";

export class DownloadModel extends BaseModel{
  name:string;
  filePath:string;
  fileType:string;
  type:any;
}
