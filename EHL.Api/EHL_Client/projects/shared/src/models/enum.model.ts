export class EnumBase{
  public get Language(){
    return Language;
  }
}

export enum Language{
  en="English",
  hi="हिंदी (Hindi)",
  kd="ಕನ್ನಡ (Kannada)",
  tl="தமிழ் (Tamil)",
  od="ଓଡିଆ (Odia)",
  pj="ਪੰਜਾਬੀ (Punjabi)",
  mr="मराठी (Marathi)",
  ml="മലയാളം (Malayalam)",
  tg="తెలుగు (Telugu)",
  asm="অসমীয়া (Assamese)",
  gj="ગુજરાતી (Gujarati)",
  bg="বাংলা (Bengali)"
}

export enum PermissionItem {
  SchoolDetails = "SchoolDetails",
  UserDetails = "UserDetails",
  Classes = "Classes",
  Subjects = "Subjects",
  AddSubjectToBoard = "AddSubjectToBoard",
  StudentsDetail = "StudentsDetail",
  AddScholarShips = "AddScholarShips",
  TeachersDetail = "TeachersDetail"
}
export enum PermissionAction {
  Create = "Create",
  Update = "Update",
  UpdateAll = "Update All",
  View = "View",
  ViewAll = "View All",
  Delete = "Delete",
  DeleteAll= "Delete All"
}
