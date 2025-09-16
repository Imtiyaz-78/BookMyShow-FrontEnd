import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../../services/common.service';
import { debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs';
import { ToastService } from '../toast/toast.service';

@Component({
  selector: 'app-searcbox',
  standalone: false,
  templateUrl: './searcbox.component.html',
  styleUrls: ['./searcbox.component.scss'],
})
export class SearcboxComponent implements OnInit {
  currentIndex: number = 0;
  visibleCount: number = 6;
  searchControlInput = new FormControl('');
  movieData: any[] = [];

  eventsFilters: any[] = [
    'Movies',
    'Stream',
    'Events',
    'Plays',
    'Sports',
    'Activites',
    'Venues',
    'Offers',
    'Others',
  ];
  private modalRef?: NgbModalRef;

  constructor(
    private modalService: NgbModal,
    private commonService: CommonService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.onGlobalSearch();
  }
  open(content: TemplateRef<any>) {
    this.modalRef = this.modalService.open(content, {
      modalDialogClass: 'searchbox',
      ariaLabelledBy: 'modal-basic-title',
    });
  }

  close() {
    if (this.modalRef) {
      this.modalRef.close();
    }
  }

  getVisibleFilters() {
    return this.eventsFilters.slice(
      this.currentIndex,
      this.currentIndex + this.visibleCount
    );
  }

  next() {
    if (this.currentIndex + this.visibleCount < this.eventsFilters.length) {
      this.currentIndex++;
    }
  }

  prev() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }

  payload: {
    name: string;
    eventTypes: string[];
  } = {
    name: '',
    eventTypes: [],
  };

  // This method is used to handle search input changes
  onGlobalSearch(): void {
    this.searchControlInput.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap((query: any) => {
          this.payload.name = query;
        }),
        switchMap(() => this.commonService.searchEvents(this.payload))
      )
      .subscribe({
        next: (res: any) => {
          this.movieData = res.data;
        },
        error: (err) => {
          this.toastService.startToast(err.message);
        },
      });
  }

  // Add filters
  onSendFilterData(item: any): void {
    const index = this.payload.eventTypes.indexOf(item);
    if (index === -1) {
      this.payload.eventTypes.push(item);
    } else {
      this.payload.eventTypes.splice(index, 1);
    }
  }
}
