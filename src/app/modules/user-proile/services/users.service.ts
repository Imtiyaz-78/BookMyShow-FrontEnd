import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../core/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  getUserDetailsById(userId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/users/${userId}/profile`);
  }

  updateUserDetails(userId: number, obj: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/users/${userId}/profile`, obj);
  }
}
