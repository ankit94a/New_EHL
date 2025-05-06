import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Category, SubCategory, Wing } from 'projects/shared/src/models/attribute.model';
import { ApiService } from 'projects/shared/src/service/api.service';
import { SharedLibraryModule } from 'projects/shared/src/shared-library.module';

@Component({
  selector: 'app-sub-category',
  standalone: true,
  imports: [SharedLibraryModule],
  templateUrl: './sub-category.component.html',
  styleUrl: './sub-category.component.scss'
})
export class SubCategoryComponent {
  subCategory:SubCategory=new SubCategory();
  categoryList:Category[]=[];
  categoryId:number;
  wing:Wing[]=[]
  constructor(private apiService:ApiService,private toastr:ToastrService,private dailogRef:MatDialogRef<SubCategoryComponent>){
    this.getWing();

  }
  getWing(){
    this.apiService.getWithHeaders('attribute/wing').subscribe(res =>{
      if(res){
      this.wing=res;
      }
    })
  }
  getCategory(categoryId){
    this.apiService.getWithHeaders('attribute/category'+categoryId).subscribe(res =>{
      if(res){
        this.categoryList=res;

      }
    })
  }
  save(){
    this.apiService.postWithHeader('attribute/subcategory',this.subCategory).subscribe(res =>{
      if(res){
        this.toastr.success("Sub-Category added successfully",'success');
        this.dailogRef.close(true);
      }
    })
  }
}
