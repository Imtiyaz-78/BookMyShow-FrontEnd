import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../../../services/common.service';
import { movies } from '../../../../../../db';
import { EventsService } from '../service/events.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-event-home',
  standalone: false,
  templateUrl: './event-home.component.html',
  styleUrl: './event-home.component.scss',
})
export class EventHomeComponent implements OnInit {
  dummyMoviesdata: any[] = [];
  dummyMoviesdatafiltered: any[] = [];
  // originalMovies = movies;
  // allMoviesEvent:[] = [];
  languaageArray: any[] = [
    'Hindi',
    'English',
    'Malyalam',
    'Gujrati',
    'Panjabi',
  ];

  selectedLanguages: string[] = [];

  constructor(
    public commonService: CommonService,
    private eventService: EventsService
  ) {
    this.dummyMoviesdata = movies;
  }
  ngOnInit(): void {
    this.onGetAllMoviesDetails;
  }

  onLanguagesFilterChange(selected: string[]): void {
    selected.forEach((item) => {
      if (!this.selectedLanguages.includes(item)) {
        this.selectedLanguages.push(item); // naye item push karo
      }
    });

    // remove items jo filter mein se unselect ho gaye
    this.selectedLanguages = this.selectedLanguages.filter((item) =>
      selected.includes(item)
    );

    // sort A-Z
    this.selectedLanguages = [...this.selectedLanguages].sort((a, b) =>
      a.localeCompare(b)
    );
  }

  // Get all moview Details
  allMoviesEvent: any[] = [];

  onGetAllMoviesDetails() {
    const eventTypes = ['Movie', 'Plays', 'Sports', 'Events'];

    const requests = eventTypes.map((type) =>
      this.eventService.getAllPoplularEvents(type)
    );

    forkJoin(requests).subscribe({
      next: (responses) => {
        debugger;
        this.allMoviesEvent = responses.flat();

        console.log('All Events:', this.allMoviesEvent);
      },
      error: (err) => {
        console.error('Error while fetching events:', err);
      },
    });
  }
}
