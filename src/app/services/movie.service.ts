import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../core/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  // This method is use for get movie Details by Id
  getMovieDetailsById(movieId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/events/${movieId}`);
  }
  /**
   * @description Get languages list by event type (Movie, Events, Sports, etc.)
   * @author Imtiyaz
   * @param {string} eventType
   * @returns Observable<any>
   */
  getLanguagesByEventType(eventType: string): Observable<any> {
    return this.http.get(
      `${this.baseUrl}/events/languages?eventType=${eventType}`
    );
  }

  /**
   * @description Get genres list by event type (Movie, Events, Sports, etc.)
   * @author Imtiyaz
   * @param {string} eventType
   * @returns Observable<any>
   */
  getGenresByEventType(eventType: string): Observable<any> {
    return this.http.get(
      `${this.baseUrl}/events/genres?eventType=${eventType}`
    );
  }
}
