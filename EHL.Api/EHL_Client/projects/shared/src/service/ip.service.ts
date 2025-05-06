import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IpService {
  private ipApiUrl = 'https://api.ipify.org?format=json';

  constructor(private http: HttpClient) {}

  getIpAddress(): Observable<{ ip: string }> {
    return this.http.get<{ ip: string }>(this.ipApiUrl);
  }
}
