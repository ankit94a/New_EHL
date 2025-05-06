import { BaseModel } from "./base.model";

export class News extends BaseModel{
  text:string;
  status:NewsStatus;
}
export class LandingProfile extends BaseModel{
  title:string;
  description:string;
  profile:string;
}
export class LandingCarousel extends BaseModel{
  images:string[];
}

export enum NewsStatus{
  new=1,
  old=2
}
