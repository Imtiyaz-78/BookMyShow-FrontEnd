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
  isLoggedIn$ = new BehaviorSubject<boolean>(this.hasToken());
  isLoggedIn = signal<boolean>(this.hasToken());
  userDetails = signal<UserToken | null>(null);
  constructor(private http: HttpClient) {}

  loginSuccess(token: string) {
    localStorage.setItem('token', token);
    // this.isLoggedIn$.next(true);
    this.isLoggedIn.set(true);

    // decode token and store user details
    const decoded: any = this.decodeToken(token);
    this.userDetails.set(decoded);
  }

  hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  decodeToken(token: string): void {
    const decoded: any = jwtDecode(token);
    console.log('Decoded Token:', decoded);
    return decoded;
  }

  // login API Method
  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials);
  }

  logout(): void {
    localStorage.removeItem('token');
    // this.isLoggedIn$.next(false);
    this.isLoggedIn.set(false);
  }

  // Register API Method
  createNewUser(obj: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, obj);
  }
}

export interface UserToken {
  sub: string; // username
  role: string; // role
  iat: number; // issued at
  exp: number; // expiry
}
