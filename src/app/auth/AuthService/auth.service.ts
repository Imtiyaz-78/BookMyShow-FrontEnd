import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map } from 'rxjs';
import * as CryptoJS from 'crypto-js';
import { jwtDecode } from 'jwt-decode';

type JwtPayload = Record<string, any>;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://172.31.252.101:8080/bookmyshow/auth';
  isLoggedIn = signal<boolean>(this.hasToken());
  userDetails = signal<UserToken | null>(null);

  constructor(private http: HttpClient) {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = this.decodeToken(token);
      this.userDetails.set(decoded);
      this.isLoggedIn.set(true);
    }
  }

  loginSuccess(token: string) {
    localStorage.setItem('token', token);
    this.isLoggedIn.set(true);

    // decode token and store user details
    const decoded: any = this.decodeToken(token);
    this.userDetails.set(decoded);
    console.log(decoded);
  }

  hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  decodeToken(token: string): UserToken | null {
    try {
      const decoded: any = jwtDecode(token);
      console.log('Decoded Token:', decoded);
      return decoded as UserToken;
    } catch (err) {
      console.error('Token decode error:', err);
      return null;
    }
  }

  // login API Method
  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials);
  }

  logout(): void {
    localStorage.removeItem('token');
    this.isLoggedIn.set(false);
    this.userDetails.set(null);
  }

  // Register API Method
  createNewUser(obj: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, obj);
  }
}

export interface UserToken {
  sub: string;
  role: string;
  iat: number;
  exp: number;
}
