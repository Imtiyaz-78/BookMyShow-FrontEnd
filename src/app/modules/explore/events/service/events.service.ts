import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../core/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class EventsService {
  baseUrl = environment.baseUrl;
  http = inject(HttpClient);

  constructor() {}

  getAllPoplularEvents(movie: any) {
    return this.http.get(
      `${this.baseUrl}/events/get-popular-events?eventType=${movie}`
    );
  }
}
