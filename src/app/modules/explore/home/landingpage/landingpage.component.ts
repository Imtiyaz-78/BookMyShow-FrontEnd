import { Component, ElementRef, ViewChild } from '@angular/core';
import { movies } from '../../../../../../db';
import { forkJoin } from 'rxjs';
import { EventsService } from '../../events/service/events.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-landingpage',
  templateUrl: './landingpage.component.html',
  styleUrls: ['./landingpage.component.scss'],
})
export class LandingPageComponent {
  dummyMoviesdata: any[] = [];
  dummyMoviesdatafiltered: any[] = [];
  originalMovies = movies;
  pageNo = 0;
  itemsperpage = 6;
  start = 0;
  end = 0;
  constructor(
    private eventService: EventsService,
    private sanitizer: DomSanitizer
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

  onGetAllMoviesDetails() {
    const eventTypes = ['Movie', 'Plays', 'Sports', 'Activities', 'Events'];
    const requests = eventTypes.map((type) =>
      this.eventService.getAllPoplularEvents(type)
    );

    forkJoin(requests).subscribe({
      next: (responses) => {
        eventTypes.forEach((type, i) => {
          this.allMoviesEvent[type] = responses[i];
        });

        // console.log('All Events:', this.allMoviesEvent);
        // var res = this.allMoviesEvent['Movie'].data;
        // console.log('Moviews Data', res);
        // console.log('Moviews Id', res[0].imageurl);
      },
      error: (err) => {
        console.error('Error while fetching events:', err);
      },
    });
  }
}
