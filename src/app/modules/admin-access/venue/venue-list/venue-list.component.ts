import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../service/admin.service';
import { CommonService } from '../../../../services/common.service';
import { ToastService } from '../../../../shared/components/toast/toast.service';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, filter, switchMap } from 'rxjs';
import { Router } from '@angular/router';

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
    private toastService: ToastService,
    private router: Router
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
        this.venues = [...this.allVenues];
        this.movieDropDownList = [
          ...new Set(this.allVenues.map((venue: any) => venue.venueType)),
        ];
      },
      error: (err) => {
        this.toastService.startToast({
          message: err.message,
          type: 'error',
        });
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
          this.toastService.startToast({
            message: err.message,
            type: 'error',
          });
        },
      });
  }

  // Filter by selected movie type (frontend)
  filterMovieByType() {
    this.MovieTypeValue.valueChanges.subscribe((selectedType: any) => {
      if (!selectedType) {
        this.venues = [...this.allVenues];
        return;
      }
      this.venues = this.allVenues.filter(
        (venue) => venue.venueType === selectedType
      );
    });
  }

  // This Method is used for Edit the Venue
  onEditVenue(venueId: any, venue: any) {
    this.router.navigate(['/admin/create-venue'], {
      queryParams: { venueId },
      state: { venueData: venue },
    });
  }

  // This method is use for Delete Venue
  onDeleteByVenueId(venueId: any) {
    this.adminService.deleteVenueById(venueId).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.toastService.startToast({
            message: res.message,
            type: 'success',
          });
        }
      },
    });
  }
}
