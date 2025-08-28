import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  selectedCity = sessionStorage.getItem('selectedCity');
  selectedCitySignal = signal<any>(
    this.selectedCity ? this.selectedCity : null
  );
  profileHeaderSignal = signal<any>(false);
  private baseApiUrl = 'http://172.31.252.101:8080/bookmyshow/city/';
  constructor() {}

  http = inject(HttpClient);

  getAllCity() {
    return this.http.get(`${this.baseApiUrl}all`);
  }

  getAllPopularCity() {
    return this.http.get(`${this.baseApiUrl}popular`);
  }
}
