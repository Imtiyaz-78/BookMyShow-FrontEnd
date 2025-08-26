import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import * as CryptoJS from 'crypto-js';
import { jwtDecode } from 'jwt-decode';

type JwtPayload = Record<string, any>;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://172.31.252.101:8080/bookmyshow/auth';
  static readonly SECRET_KEY = 'your-256-bit-secret';

  constructor(private http: HttpClient) {}

  // login API Method
  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials);
  }

  logout(): void {
    localStorage.removeItem('token');
  }

  // Register API Method
  createNewUser(obj: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, obj);
  }
}
