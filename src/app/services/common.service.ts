import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { environment } from '../core/environments/environment';

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

  getAllCity() {
    return this.http.get(`${this.baseApiUrl}/city/all`);
  }

  getAllPopularCity() {
    return this.http.get(`${this.baseApiUrl}/city/popular`);
  }
}
