import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../service/admin.service';
import { CommonService } from '../../../../services/common.service';
import { ToastService } from '../../../../shared/components/toast/toast.service';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, filter, switchMap } from 'rxjs';

@Component({
  selector: 'app-venue-list',
  standalone: false,
  templateUrl: './venue-list.component.html',
  styleUrl: './venue-list.component.scss',
})
export class VenueListComponent implements OnInit {
  cityValue = new FormControl('');
  MovieTypeValue = new FormControl('');
  cityList: string[] = [];
  allVenues: any[] = [];
  venues: any[] = [];
  movieDropDownList: any[] = [
    'Movie',
    'Sports',
    'Event',
    'Activities',
    'Plays',
  ];

  constructor(
    private adminService: AdminService,
    private commonService: CommonService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.onGetAllVenues();
    this.getAllcity();
    this.onFilterVenue();
    this.filterMovieByType();
  }

  onGetAllVenues() {
    this.adminService.getAllVenues().subscribe({
      next: (res: any) => {
        this.allVenues = res.data.filter(
          (venue: any) => venue.venueType != null
        );

        // Displayed list initially
        this.venues = [...this.allVenues];

        // Build unique dropdown list
        this.movieDropDownList = [
          ...new Set(this.allVenues.map((venue: any) => venue.venueType)),
        ];

        console.log('All venues:', this.allVenues);
        console.log('Dropdown list:', this.movieDropDownList);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  // This method is to Get All City
  getAllcity() {
    this.commonService.getAllCity().subscribe({
      next: (res: any) => {
        if (res.success) {
          this.cityList = res.data.map((city: any) => city.cityName);
        }
      },
      error: (err) => {
        this.toastService.startToast({
          message: err.message,
          type: 'error',
        });
      },
    });
  }

  // This Method is used to filter Venue by Venue List
  onFilterVenue() {
    this.cityValue.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((cityName: string | null) => {
          if (!cityName) {
            return this.adminService.getAllVenues();
          }
          return this.adminService.filterVenue(cityName);
        })
      )
      .subscribe({
        next: (res: any) => {
          this.venues = res.data;
        },
        error: (err) => {
          console.error('Error fetching venues:', err);
        },
      });
  }

  // Filter by selected movie type (frontend)
  filterMovieByType() {
    this.MovieTypeValue.valueChanges.subscribe((selectedType: any) => {
      if (!selectedType) {
        // If no type selected, show all venues
        this.venues = [...this.allVenues];
        return;
      }

      // Filter frontend array by venueType
      this.venues = this.allVenues.filter(
        (venue) => venue.venueType === selectedType
      );

      console.log('Filtered venues:', this.venues);
    });
  }
}
