import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Category, Eqpt, SubCategory, Wing } from 'projects/shared/src/models/attribute.model';
import { ApiService } from 'projects/shared/src/service/api.service';
import { SharedLibraryModule } from 'projects/shared/src/shared-library.module';

@Component({
  selector: 'app-eqpt',
  standalone: true,
  imports: [SharedLibraryModule],
  templateUrl: './eqpt.component.html',
  styleUrl: './eqpt.component.scss'
})
export class EqptComponent {
  categoryList:Category[]=[];
  subCategoryList:SubCategory[]=[];
  eqpt:Eqpt=new Eqpt();
    wing:Wing[]=[]
   constructor(private apiService:ApiService,private toastr:ToastrService,private dailogRef:MatDialogRef<EqptComponent>){
      this.getWing();
    }
    getCategory(categoryId){
      this.apiService.getWithHeaders('attribute/category'+categoryId).subscribe(res =>{
        if(res){
          this.categoryList=res;

        }
      })
    }
    getWing(){
      this.apiService.getWithHeaders('attribute/wing').subscribe(res =>{
        if(res){
        this.wing=res;
        }
      })
    }
    getSubCategory(categoryId){
      this.apiService.getWithHeaders('attribute/subcategory'+categoryId).subscribe(res =>{
        if(res){
          this.subCategoryList = res;
        }
      })
    }
    save(){
      this.apiService.postWithHeader('attribute/eqpt',this.eqpt).subscribe(res =>{
        if(res){
          this.toastr.success("Sub-Category added successfully",'success');
          this.dailogRef.close(true);
        }
      })
    }
}
