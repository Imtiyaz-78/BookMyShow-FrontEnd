import { CommonModule, NgClass } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FeatherModule } from 'angular-feather';
import { CommonService } from '../../../services/common.service';
import { AuthService } from '../../../auth/AuthService/auth.service';
import { ToastService } from '../toast/toast.service';

@Component({
  selector: 'app-filter-accordian',
  standalone: true,
  imports: [CommonModule, FeatherModule],
  templateUrl: './filter-accordian.component.html',
  styleUrl: './filter-accordian.component.scss',
})
export class FilterAccordianComponent {
  filterShowButtons: boolean = true;
  @Input() label: string = '';
  @Input() filtersList: string[] = [];
  @Input() clearable: boolean = true;
  @Output() filterChange = new EventEmitter<string[]>();
  selectedFilters: string[] = [];

  constructor(
    private tostService: ToastService,
    private commmonService: CommonService
  ) {}

  toggleAccoridan(): void {
    this.filterShowButtons = !this.filterShowButtons;
  }

  onFilterClick(option: string): void {
    if (this.selectedFilters.includes(option)) {
      this.selectedFilters = this.selectedFilters.filter((o) => o !== option);
    } else {
      this.selectedFilters.push(option);
    }
    this.filterChange.emit(this.selectedFilters);
  }

  clearFilters(): void {
    this.selectedFilters = [];
    this.filterShowButtons = false; // close accordion
    this.tostService.startToast({
      message: 'Filters cleared successfully ',
    });
    this.filterChange.emit(this.selectedFilters);
  }

  get eventType() {
    return this.commmonService.eventType();
  }
}
