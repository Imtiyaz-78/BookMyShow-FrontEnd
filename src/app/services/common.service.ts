import { HttpClient } from '@angular/common/http';
import { effect, inject, Injectable, signal } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { environment } from '../core/environments/environment';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  storedCity = sessionStorage.getItem('selectedCity');
  selectedCitySignal = signal<string | null>(this.storedCity);
  profileHeaderSignal = signal<any>(false);
  baseApiUrl = environment.baseUrl;
  eventType = signal<string | null>(null);

  constructor() {
    // restore from sessionStorage if available
    const eventValue = sessionStorage.getItem('eventType');
    if (eventValue) {
      this.eventType.set(eventValue);
    }
    effect(() => {
      this.selectedCitySignal();
    });
  }

  http = inject(HttpClient);
  sanitizer = inject(DomSanitizer);

  getAllCity() {
    return this.http.get(`${this.baseApiUrl}/city/all`);
  }

  getAllPopularCity() {
    return this.http.get(`${this.baseApiUrl}/city/popular`);
  }

  // This Method for GLobal Search events by name and eventTypes
  searchEvents(payload: {
    name: string;
    eventTypes: string[];
  }): Observable<any> {
    const url = `${this.baseApiUrl}/events/search`;
    return this.http.post<any>(url, payload);
  }

  getImageFromBase64(base64string: string): any {
    if (base64string) {
      let imageType = base64string;

      const fullBase64String = `data:${imageType};base64,${base64string}`;
      return this.sanitizer.bypassSecurityTrustUrl(fullBase64String);
    }
  }

  // This for Formate the Date
  formatDateToMMDDYYYY(date: string | null): string | null {
    if (!date) return null;
    const d = new Date(date);
    const month = (d.getMonth() + 1).toString().padStart(2, '0'); // MM
    const day = d.getDate().toString().padStart(2, '0'); // DD
    const year = d.getFullYear();
    return `${month}/${day}/${year}`; // MM/DD/YYYY
  }

  setEventType(type: string) {
    this.eventType.set(type);
    sessionStorage.setItem('eventType', type);
  }

  clearEventType() {
    this.eventType.set(null);
    sessionStorage.removeItem('eventType');
  }

  //  Fetch notifications for a user with pagination
  getNotifications(
    userId: number,
    page: number = 0,
    size: number = 4
  ): Observable<any> {
    const url = `${this.baseApiUrl}/notifications/get-notification/${userId}?page=${page}&size=${size}`;
    return this.http.get<any>(url);
  }

  getUnreadCount(userId: number): Observable<any> {
    return this.http.get(
      `${this.baseApiUrl}/notifications/get-notification-unread-count/${userId}`
    );
  }
}
