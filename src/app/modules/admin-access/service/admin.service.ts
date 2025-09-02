import { Injectable } from '@angular/core';
import { environment } from '../../../core/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private apiUrl = environment.baseUrl;
  constructor(private http: HttpClient) {}

  getUsers() {
    return this.http.get(this.apiUrl);
  }

  editUserById(userId: string, userData: any) {
    return this.http.put(`${this.apiUrl}/${userId}`, userData);
  }
}
