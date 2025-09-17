import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
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
  private baseApiUrl = environment.baseUrl;

  constructor() {}

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
}
