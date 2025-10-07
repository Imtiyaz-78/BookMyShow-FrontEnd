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

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
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

    // start with one screen & layout
    this.addScreen();
    this.addLayout(0);
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
  onSubmit() {
    if (this.venueForm.invalid) return;

    const payload = {
      ...this.venueForm.value,
      amenities: this.venueForm.value.amenities
        ? this.venueForm.value.amenities.split(',').map((a: string) => a.trim())
        : [],
      supportedCategories: [this.venueForm.value.supportedCategories],
    };

    console.log('Final Payload:', payload);

    this.http.post(this.apiUrl, payload).subscribe({
      next: (res) => {
        this.toastService.startToast({
          message: 'Venue Created Successfully',
          type: 'success',
        });
        this.venueForm.reset();
      },
      error: (err) => {
        alert(err.message);
      },
    });
  }
}
