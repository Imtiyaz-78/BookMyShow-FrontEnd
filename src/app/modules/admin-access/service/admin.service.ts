import { Injectable } from '@angular/core';
import { environment } from '../../../core/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private apiUrl = environment.baseUrl;
  constructor(private http: HttpClient) {}

  getUsers() {
    return this.http.get(`${this.apiUrl}/users`);
  }

  editUserById(userId: string, userData: any) {
    return this.http.put(`${this.apiUrl}/${userId}`, userData);
  }

  /**
   * @description Get user by userId
   * @param {number} userId - ID of the user
   * @returns {Observable<any>}
   */
  getUserById(userId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/users/${userId}`);
  }

  /**
   * @description   Update User by userId and UserRole
   * @param {number} userId - ID of the user
   * @returns {Observable<any>}
   */
  updateUserRole(userId: number, roleName: string): Observable<any> {
    return this.http.put<any>(
      `${this.apiUrl}/users/${userId}/role?roleName=${roleName}`,
      {}
    );
  }

  searchUserByUserName(value: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/users/search?value=${value}`);
  }
}
