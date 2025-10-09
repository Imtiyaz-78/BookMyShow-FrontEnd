import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { AdminService } from '../../../service/admin.service';
import { ToastService } from '../../../../../shared/components/toast/toast.service';
import { EventsService } from '../../../../explore/events/service/events.service';
import { CommonService } from '../../../../../services/common.service';

@Component({
  selector: 'app-content-list',
  standalone: false,
  templateUrl: './content-list.component.html',
  styleUrls: ['./content-list.component.scss'],
})
export class ContentListComponent implements OnInit {
  movies: any[] = [];
  plays: any[] = [];
  sports: any[] = [];
  activities: any[] = [];
  events: any[] = [];
  movieList: any[] = [];

  page = 1;
  size = 2;
  count = 0;
  isLoading = false;

  private readonly eventTypes = ['Movie', 'Plays', 'Sports', 'Activities', 'Events'];

  constructor(
    private adminService: AdminService,
    private toastService: ToastService,
    private eventService: EventsService,
    public commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.onGetAllMoviesDetails();
  }

  /**
   * Fetch all event types in parallel
   */
  onGetAllMoviesDetails(): void {
    if (this.isLoading) return;
    this.isLoading = true;

    const requests = this.eventTypes.map((type) =>
      this.adminService.getAllEventList(type, this.page, this.size)
    );

    forkJoin(requests).subscribe({
      next: (responses: any[]) => {
        this.isLoading = false;

        responses.forEach((res, i) => {
          const type = this.eventTypes[i];
          const list = res?.data?.content || [];
          const totalCount = res?.data?.count || 0;

          switch (type) {
            case 'Movie':
              this.movies = [...this.movies, ...list];
              break;
            case 'Plays':
              this.plays = [...this.plays, ...list];
              break;
            case 'Sports':
              this.sports = [...this.sports, ...list];
              break;
            case 'Activities':
              this.activities = [...this.activities, ...list];
              break;
            case 'Events':
              this.events = [...this.events, ...list];
              break;
          }

          // Update count only from first API (Movie)
          if (i === 0 && totalCount) {
            this.count = totalCount;
          }
        });

        // Merge all events into one combined list (optional)
        this.movieList = [
          ...this.movies,
          ...this.plays,
          ...this.sports,
          ...this.activities,
          ...this.events,
        ];

        console.log(' Loaded page:', this.page, 'Total count:', this.count);
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error while fetching events:', err);
        this.toastService.startToast({
          message: err?.message || 'Failed to load event data',
          type: 'error',
        });
      },
    });
  }


  onScroll(event:any): void {
    const isMovieCountReached = this.movieList.length >= this.count;
    if (isMovieCountReached || this.isLoading) return;

    this.page++;
    this.onGetAllMoviesDetails();
  }
}
