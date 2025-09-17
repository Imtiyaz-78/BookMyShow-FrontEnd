import { Component, effect, ElementRef, ViewChild } from '@angular/core';
import { movies } from '../../../../../../db';
import { forkJoin, Observable } from 'rxjs';
import { EventsService } from '../../events/service/events.service';
import { DomSanitizer } from '@angular/platform-browser';
import { CommonService } from '../../../../services/common.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-landing-page',
  standalone: false,
  templateUrl: './home-landing-page.component.html',
  styleUrl: './home-landing-page.component.scss',
})
export class HomeLandingPageComponent {
  dummyMoviesdata: any[] = [];
  dummyMoviesdatafiltered: any[] = [];
  originalMovies = movies;
  pageNo = 0;
  itemsperpage = 6;
  start = 0;
  end = 0;
  constructor(
    private eventService: EventsService,
    private sanitizer: DomSanitizer,
    public commonService: CommonService,
    private router: Router
  ) {
    this.dummyMoviesdata = movies;
    this.getVisibleMovieCard();
    this.onGetAllMoviesDetails();
  }

  getVisibleMovieCard() {
    this.start = this.itemsperpage * this.pageNo;
    this.end = this.start + this.itemsperpage;
    this.dummyMoviesdatafiltered = this.originalMovies.slice(
      this.start,
      this.end
    );
  }

  next() {
    if (this.end < this.originalMovies.length) {
      this.pageNo++;
      this.getVisibleMovieCard();
    }
  }

  prev() {
    if (this.start > 0) {
      this.pageNo--;
      this.getVisibleMovieCard();
    }
  }

  getImageFromBase64(base64string: string): any {
    if (base64string) {
      let imageType = base64string;

      const fullBase64String = `data:${imageType};base64,${base64string}`;
      return this.sanitizer.bypassSecurityTrustUrl(fullBase64String);
    }
  }

  // Get all moview Details
  allMoviesEvent: { [key: string]: any } = {};
  paginationState: { [key: string]: any } = {};

  // Fetch all event types
  onGetAllMoviesDetails() {
    const eventTypes = ['Movie', 'Plays', 'Sports', 'Activities'];
    const requests = eventTypes.map(
      (type) =>
        this.eventService.getAllPoplularEvents(type) as unknown as Observable<
          ApiResponse<any>
        >
    );

    forkJoin(requests).subscribe({
      next: (responses) => {
        eventTypes.forEach((type, i) => {
          const data = responses[i]?.data || [];
          this.allMoviesEvent[type] = data;

          this.paginationState[type] = {
            pageNo: 0,
            pageSize: 5,
            start: 0,
            end: Math.min(5, data.length),
            total: data.length,
            visibleItems: data.slice(0, 6),
          };
        });
      },
      error: (err) => console.error('Error fetching events:', err),
    });
  }

  // Handle Next Pagination
  goToNext(type: string) {
    const state = this.paginationState[type];
    if (!state) return;

    if (state.end < state.total) {
      state.pageNo++;
      state.start = state.pageNo * state.pageSize;
      state.end = Math.min(state.start + state.pageSize, state.total);
      state.visibleItems = this.allMoviesEvent[type].slice(
        state.start,
        state.end
      );
    }
  }

  // Handle Previous Pagination
  goToPrevious(type: string) {
    const state = this.paginationState[type];
    if (!state) return;

    if (state.start > 0) {
      state.pageNo--;
      state.start = state.pageNo * state.pageSize;
      state.end = Math.min(state.start + state.pageSize, state.total);
      state.visibleItems = this.allMoviesEvent[type].slice(
        state.start,
        state.end
      );
    }
  }

  // This method is used for Navigate on Movie Details Page
  goToMovieDetails(item: any): void {
    const city = this.commonService.selectedCitySignal();
    this.router.navigate(['/movies', city, item.eventId]);
  }
}

interface ApiResponse<T> {
  success: boolean;
  data: T[];
}
