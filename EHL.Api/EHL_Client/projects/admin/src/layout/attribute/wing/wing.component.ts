import { Component, Inject } from '@angular/core';
// import { MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Wing } from 'projects/shared/src/models/attribute.model';
import { ApiService } from 'projects/shared/src/service/api.service';
import { SharedLibraryModule } from 'projects/shared/src/shared-library.module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { SecureComponent } from 'projects/shared/src/component/secure/secure.component';
import { EncryptionService } from 'projects/shared/src/service/encryption.service';

@Component({
  selector: 'app-wing',
  standalone: true,
  imports: [SharedLibraryModule],
  templateUrl: './wing.component.html',
  styleUrl: './wing.component.scss',
})
export class WingComponent {
  attributeData: FormGroup;
  wing: Wing = new Wing();
  apiUrl: string = '';
  constructor(
    @Inject(MAT_DIALOG_DATA) data: any,
    private apiSerive: ApiService,
    private dialogRef: MatDialogRef<WingComponent>,
    private toastr: ToastrService,
    private dailogRef: MatDialogRef<WingComponent>,
    // private SecureComponent: SecureComponent,
    private EncryptionService:EncryptionService,
    private fb: FormBuilder
  ) {
    if (data != null) {
      this.bindDataToForm(data);
    } else {

      this.createForm();
    }
    // attribute/wing/update
    this.apiUrl = this.wing.id > 0 ? 'attribute/wing/update' : 'attribute/wing';
  }
  bindDataToForm(attrData) {

    this.wing.name = attrData.name;
    this.wing.id = attrData.id;
  }
  createForm() {
    this.wing.name = '';
    this.wing.id = 0;
  }

  close() {
    this.dialogRef.close(true);
  }
  reset() {
    this.createForm();
  }

  async save() {

  //   const encryptedName = await this.EncryptionService.encrypt(this.wing.name);

  // // Replace wing name with encrypted string before saving
  // const encryptedWing = {
  //   ...this.wing,
  //   name: encryptedName
  // };
  // Replace wing name with encrypted data before saving
    this.apiSerive.postWithHeader(this.apiUrl, this.wing).subscribe((res) => {
      if (res) {
        this.toastr.success('Category added successfully', 'success');
        this.dailogRef.close(true);
      }
    });
  }
}
