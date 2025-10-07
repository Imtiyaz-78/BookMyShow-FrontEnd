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

  getUsers(page: number = 0, size: number = 10) {
    return this.http.get<any>(`${this.apiUrl}/users?page=${page}&size=${size}`);
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
  updateUserRole(userId: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/users/${userId}/role`, {});
  }

  searchUserByUserName(value: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/users/search?value=${value}`);
  }

  getUserByUserRole(roleName: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/users/role/${roleName}`);
  }

  deleteUserById(userId: number): Observable<any> {
    return this.http.patch<any>(
      `${this.apiUrl}/users/delete-user/${userId}`,
      {}
    );
  }

  // This method is for making a user an admin
  makeUserAdmin(userId: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/users/${userId}/role`, {
      roleName: 'ADMIN',
    });
  }

  // This method for get All Venue List
  getAllVenues(): Observable<any> {
    return this.http.get<any>(
      `http://172.31.252.101:8080/bookmyshow/venues/getAll`
    );
  }

  // Filter Venue by City
  filterVenue(city: any): Observable<any> {
    return this.http.get<any>(
      `http://172.31.252.101:8080/bookmyshow/venues/city/${city}`
    );
  }

  // Update Venue by VenueID
  updateVenueByID(venueId: number, payload: any): Observable<any> {
    const url = `http://172.31.252.101:8080/bookmyshow/venues/${venueId}/update`;
    return this.http.put<any>(url, payload);
  }

  // Delete venueById
  deleteVenueById(venueId: number): Observable<any> {
    const url = `http://172.31.252.101:8080/bookmyshow/venues/delete/${venueId}`;
    return this.http.patch<any>(url, {});
  }

  // Get Movie List
  getAllMovieList() {
    // this.http.get('');
  }
}
