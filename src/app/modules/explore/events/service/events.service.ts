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

  //  Date Filters
  getDateFilters() {
    return this.http.get(`${this.baseUrl}/events/date-filters`);
  }

  //  Languages
  getLanguages(eventType: string) {
    return this.http.get(
      `${this.baseUrl}/events/languages?eventType=${eventType}`
    );
  }

  //  Categories
  getCategories(eventType: string) {
    return this.http.get(
      `${this.baseUrl}/events/categories?eventType=${eventType}`
    );
  }

  //  More Filters
  getMoreFilters(eventType: string) {
    return this.http.get(
      `${this.baseUrl}/events/more-filters?eventType=${eventType}`
    );
  }

  //  Price Filters
  getPrices() {
    return this.http.get(`${this.baseUrl}/events/prices`);
  }

  // Tags
  getTags() {
    return this.http.get(`${this.baseUrl}/events/tags`);
  }

  // Release Months
  getReleaseMonths() {
    return this.http.get(`${this.baseUrl}/events/release-months`);
  }

  // Formats
  getFormats(eventType: string) {
    return this.http.get(
      `${this.baseUrl}/events/formats?eventType=${eventType}`
    );
  }

  // Genres
  getGenres(eventType: string) {
    return this.http.get(
      `${this.baseUrl}/events/genres?eventType=${eventType}`
    );
  }
}
