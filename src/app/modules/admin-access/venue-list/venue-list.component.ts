import { Component, OnInit } from '@angular/core';
import { AdminService } from '../service/admin.service';

@Component({
  selector: 'app-venue-list',
  standalone: false,
  templateUrl: './venue-list.component.html',
  styleUrl: './venue-list.component.scss',
})
export class VenueListComponent implements OnInit {
  venues: any[] = [];
  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.onGetAllVenues();
  }

  onGetAllVenues() {
    this.adminService.getAllVenues().subscribe({
      next: (res: any) => {
        this.venues = res;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
