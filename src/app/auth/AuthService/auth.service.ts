import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map } from 'rxjs';
import * as CryptoJS from 'crypto-js';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../core/environments/environment';
type JwtPayload = Record<string, any>;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://172.31.252.101:8080/bookmyshow/auth';
  isLoggedIn = signal<boolean>(false);
  userDetails = signal<any>(null);
  encrypted!: string;
  secretKey: string;

  constructor(private http: HttpClient) {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = this.decodeToken(token);
      this.userDetails.set(decoded);
      this.isLoggedIn.set(true);
    }

    this.secretKey = environment.secretKey;
  }

  /**
   * @description Handles login success by storing token, updating login state, and decoding user details.
   * @author Imtiyaz
   * @param {string} token - JWT authentication token
   * @returns void
   */
  loginSuccess(token: string) {
    localStorage.setItem('token', token);
    this.isLoggedIn.set(true);

    // decode token and store user details
    const decoded: any = this.decodeToken(token);
    this.userDetails.set(decoded);
    console.log(decoded);
  }

  /**
   * @description Decodes a given JWT token to extract user payload information.
   * @author Imtiyaz
   * @param {string} token - JWT authentication token
   * @returns {any} Decoded token payload or null if invalid
   */
  decodeToken(token: string): any {
    try {
      const decoded: any = jwtDecode(token);
      return decoded;
    } catch (err) {
      console.error('Token decode error:', err);
      return null;
    }
  }

  /**
   * @description Calls login API with encrypted password and returns observable response.
   * @author Imtiyaz
   * @param {{username:any, password:any}} credentials - User login details
   * @returns {Observable<any>} Observable containing API response
   */
  login(credentials: { username: any; password: any }): Observable<any> {
    const payload = {
      username: credentials.username,
      password: this.encryptUsingAES256(credentials.password),
    };
    return this.http.post<any>(
      `${this.apiUrl}/login
`,
      payload
    );
  }

  /**
   * @description Encrypts a given string using AES-256 encryption with CBC mode and PKCS7 padding.
   * @author Imtiyaz
   * @param {string} val - Plain text value to encrypt
   * @returns {string} Encrypted string
   */

  encryptUsingAES256(val: any): string {
    const _key = CryptoJS.enc.Base64.parse(this.secretKey);
    const _iv = CryptoJS.enc.Base64.parse(this.secretKey);
    let encrypted = CryptoJS.AES.encrypt(val, _key, {
      keySize: 32,
      iv: _iv,
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    });
    this.encrypted = encrypted.toString();
    console.log(this.secretKey);
    return this.encrypted;
  }

  /**
   * @description Logs out the user by clearing token, login state, and user details from storage/signals.
   * @author Imtiyaz
   * @returns void
   */
  logout(): void {
    localStorage.removeItem('token');
    sessionStorage.removeItem('selectedCity');
    this.isLoggedIn.set(false);
    this.userDetails.set(null);
  }

  /**
   * @description Calls user registration API after encrypting password and returns observable response.
   * @author Imtiyaz
   * @param {any} obj - User registration data
   * @returns {Observable<any>} Observable containing API response
   */
  createNewUser(obj: any): Observable<any> {
    const payload = {
      ...obj,
      password: this.encryptUsingAES256(obj.password),
    };
    return this.http.post(`${this.apiUrl}/register`, payload);
  }

  // Validate Exiting User
  validateUser(username: any): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/validate/username?username=${username}`
    );
  }

  isTokenExpired(): boolean {
    const token = localStorage.getItem('token');
    if (!token) return true;

    const decoded: any = this.decodeToken(token);
    if (!decoded || !decoded.exp) return true;

    const now = Math.floor(Date.now() / 1000);
    return decoded.exp <= now; // if true expired
  }
}
