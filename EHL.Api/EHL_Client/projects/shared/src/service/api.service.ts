import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, EMPTY, map, Observable, of } from 'rxjs';
import { environment } from '../enviroments/environments.development';
import { AbstractControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = environment.apiUrl;
  constructor(private http: HttpClient,private toastr:ToastrService) { }

  getWithHeaders(url: string): Observable<any> {
    return this.http.get(`${this.baseUrl}${url}`).pipe(
      map((res: any) => {
        if (res) {
          return res;
        }
      }),
      catchError((error) => {
        this.showError(error);
        return of(null);
      })
    );
  }
  postWithHeaderToDownload(url: string, data: any,): Observable<Blob> {
    const headers = new HttpHeaders({
      'Accept': 'application/octet-stream' // Ensures the backend returns binary data
    });

    return this.http.post(`${this.baseUrl}${url}`, data, {
      headers: headers,
      responseType: 'blob' // Correctly specify responseType as 'blob'
    }).pipe(
      catchError((error: any) => {
        console.error("Download error:", error);
        return this.showError(error);;
      })
    );
  }
  postWithHeader(url: string, Data: any): Observable<any> {
    this.deleteWithHeaders
    return this.http.post(`${this.baseUrl}` + url, Data).pipe(map(
      (res: any) => {
        if (res) {
          return res;
        }
      }), catchError(
        (error: any) => {
          return this.showError(error);
        }
      ))
  }

  putWithHeader(url: string, Data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}` + url, Data).pipe(map(
      (res: any) => {
        if (res) {
          return res;
        }
      }), catchError(
        (error: any) => {

          return this.showError(error);
        }
      ))
  }

  deleteWithHeaders(url: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}` + url).pipe(map(
      (res: any) => {
        if (res) {
          return res;
        }
      }), catchError(
        (error: any) => {
          return this.showError(error);
        }
      ))
  }

  public showError(error: any): Observable<any> {
    debugger
    // if (error.status === 401 || error.status === 0) {
    //   this.authService.logout();
    // }
    // else if (error.status === 500) {
    //   this.toastr.error(InfoMessage.FunctionalityError, "error");
    // }
    // else if (error.status === 400 || error.status === 404 || error.status === 403) {
    //   if (error.error != null && (typeof error.error === 'string' || error.error instanceof String)) {
    //     this.toastr.error(error.error.toString(), "error");
    //   }
       if (error.error != null && (typeof error.error === 'object' || error.constructor == Object)) {
        this.toastr.error(error.error.title.toString(), "error");
      }

    // }

    return EMPTY;
  }

  checkRequiredFieldsExceptEmerFile(form,fileType): boolean {
    const controls = form.controls;
    for (const key in controls) {
      if (key === fileType) continue;
      const control = controls[key];
      const validator = control.validator ? control.validator({} as AbstractControl) : null;
      const hasRequired = validator && validator['required'];
      if (hasRequired && (control.invalid || control.value === '' || control.value === null)) {
        return false;
      }
    }
    return true;
  }
}
