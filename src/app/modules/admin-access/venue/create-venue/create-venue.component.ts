import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ToastService } from '../../../../shared/components/toast/toast.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from '../../service/admin.service';

@Component({
  selector: 'app-create-venue',
  standalone: false,
  templateUrl: './create-venue.component.html',
  styleUrl: './create-venue.component.scss',
})
export class CreateVenueComponent implements OnInit {
  seatRows = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  venueForm!: FormGroup;
  apiUrl = 'http://172.31.252.101:8080/bookmyshow/venues/create';
  editMode = false;
  venueId!: number;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private toastService: ToastService,
    private router: Router,
    private route: ActivatedRoute,
    private adminService: AdminService
  ) {}

  ngOnInit(): void {
    this.initForm();

    // 🔹 1. Check query params for venueId
    this.route.queryParams.subscribe((params: any) => {
      const id = params['venueId'];
      if (id) {
        this.editMode = true;
        this.venueId = +id;

        // try to use data from state first (faster)
        const stateVenue = history.state.venueData;
        if (stateVenue) {
          this.patchVenueForm(stateVenue);
        } else {
          // fallback: fetch venue from backend
          // this.getVenueById(this.venueId);
        }
      } else {
        // create mode
        this.addScreen();
        this.addLayout(0);
      }
    });
  }

  initForm() {
    this.venueForm = this.fb.group({
      venueName: [''],
      venueCapacity: [0],
      venueType: [''],
      address: this.fb.group({
        street: [''],
        cityName: [''],
        pin: [''],
      }),
      amenities: [''],
      supportedCategories: [''],
      screens: this.fb.array([]),
    });
  }

  // Patch form when editing
  patchVenueForm(venue: any) {
    this.venueForm.patchValue({
      id: venue.id,
      venueName: venue.venueName,
      venueCapacity: venue.venueCapacity,
      venueType: venue.venueType,
      address: {
        street: venue.address?.street,
        cityName: venue.address?.cityName,
        pin: venue.address?.pin,
      },
      amenities: venue.amenities?.join(', ') || '',
      supportedCategories: venue.supportedCategories?.[0] || '',
    });
  }

  get screens() {
    return this.venueForm.get('screens') as FormArray;
  }

  getLayouts(screenIndex: number) {
    return this.screens.at(screenIndex).get('layouts') as FormArray;
  }

  addScreen() {
    this.screens.push(
      this.fb.group({
        screenName: [''],
        layouts: this.fb.array([]),
      })
    );
  }
  removeScreen(i: number) {
    this.screens.removeAt(i);
  }

  addLayout(screenIndex: number) {
    this.getLayouts(screenIndex).push(
      this.fb.group({
        layoutName: [''],
        rows: this.fb.array([]),
        cols: [0],
      })
    );
  }
  removeLayout(screenIndex: number, layoutIndex: number) {
    this.getLayouts(screenIndex).removeAt(layoutIndex);
  }

  toggleRowSelection(event: any, screenIndex: number, layoutIndex: number) {
    const rows = this.getLayouts(screenIndex)
      .at(layoutIndex)
      .get('rows') as FormArray;
    if (event.target.checked) {
      rows.push(this.fb.control(event.target.value));
    } else {
      const idx = rows.controls.findIndex(
        (c) => c.value === event.target.value
      );
      rows.removeAt(idx);
    }
  }

  isRowSelected(
    row: string,
    screenIndex: number,
    layoutIndex: number
  ): boolean {
    const rows = this.getLayouts(screenIndex)
      .at(layoutIndex)
      .get('rows') as FormArray;
    return rows.value.includes(row);
  }

  // Submit form to API
  // onSubmit() {
  //   if (this.venueForm.invalid) return;

  //   const payload = {
  //     ...this.venueForm.value,
  //     amenities: this.venueForm.value.amenities
  //       ? this.venueForm.value.amenities.split(',').map((a: string) => a.trim())
  //       : [],
  //     supportedCategories: [this.venueForm.value.supportedCategories],
  //   };

  //   console.log('Final Payload:', payload);

  //   this.http.post(this.apiUrl, payload).subscribe({
  //     next: (res) => {
  //       this.toastService.startToast({
  //         message: 'Venue Created Successfully',
  //         type: 'success',
  //       });
  //       this.venueForm.reset();
  //     },
  //     error: (err) => {
  //       alert(err.message);
  //     },
  //   });
  // }

  onSubmit() {
    if (this.venueForm.invalid) return;

    const payload = {
      ...this.venueForm.value,
      amenities: this.venueForm.value.amenities
        ? this.venueForm.value.amenities.split(',').map((a: string) => a.trim())
        : [],
      supportedCategories: [this.venueForm.value.supportedCategories],
    };

    if (this.editMode && this.venueId) {
      this.adminService.updateVenueByID(this.venueId, payload).subscribe({
        next: (res) => {
          this.toastService.startToast({
            message: 'Venue updated successfully',
            type: 'success',
          });
          this.router.navigate(['/admin/venue-list']);
        },
        error: (err) => {
          this.toastService.startToast({
            message: 'Error updating venue',
            type: 'error',
          });
        },
      });
    } else {
      this.http.post(this.apiUrl, payload).subscribe({
        next: (res) => {
          this.toastService.startToast({
            message: 'Venue created successfully',
            type: 'success',
          });
          this.venueForm.reset();
          this.router.navigate(['/admin/venue-list']);
        },
        error: (err) => {
          this.toastService.startToast({
            message: err.message,
            type: 'error',
          });
        },
      });
    }
  }
}
