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
  login(credentials: {
    username: string;
    password: string;
  }): Observable<JwtPayload> {
    return this.http
      .post<{ token: string; type: string }>(
        `${this.apiUrl}/login`,
        credentials
      )
      .pipe(
        map((res) => {
          // Encrypt token
          const encryptedToken = CryptoJS.AES.encrypt(
            res.token,
            AuthService.SECRET_KEY
          ).toString();
          localStorage.setItem('token', encryptedToken);
          console.log('Encrypted token:', encryptedToken);

          // Decode token
          const decoded = jwtDecode<JwtPayload>(res.token);
          console.log('Decoded Token:', decoded);

          return decoded;
        })
      );
  }

  getDecodedToken(): JwtPayload | null {
    const encryptedToken = localStorage.getItem('token');
    if (!encryptedToken) return null;
    try {
      const bytes = CryptoJS.AES.decrypt(
        encryptedToken,
        AuthService.SECRET_KEY
      );
      const decryptedToken = bytes.toString(CryptoJS.enc.Utf8);
      return jwtDecode<JwtPayload>(decryptedToken);
    } catch (e) {
      return null;
    }
  }

  isLoggedIn(): boolean {
    const encryptedToken = localStorage.getItem('token');
    if (!encryptedToken) return false;
    try {
      const bytes = CryptoJS.AES.decrypt(
        encryptedToken,
        AuthService.SECRET_KEY
      );
      const decryptedToken = bytes.toString(CryptoJS.enc.Utf8);
      const decoded = jwtDecode<JwtPayload>(decryptedToken);
      const currentTime = Math.floor(Date.now() / 1000);
      return decoded['exp'] > currentTime;
    } catch (e) {
      return false;
    }
  }

  logout(): void {
    localStorage.removeItem('token');
  }

  // Register API Method
  createNewUser(obj: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, obj);
  }
}
