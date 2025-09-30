import { Component, effect, OnInit, signal } from '@angular/core';
import { movies } from '../../../../../../db';
import { CommonService } from '../../../../services/common.service';
import { MovieService } from '../../../../services/movie.service';
import { EventsService } from '../../events/service/events.service';

@Component({
  selector: 'app-activities-list',
  standalone: false,
  templateUrl: './activities-list.component.html',
  styleUrl: './activities-list.component.scss',
})
export class ActivitiesListComponent implements OnInit {
  originalMovies = movies;

  // lists
  LanguageList: any[] = [];
  CategoriesList: any[] = [];
  MoreFiltersList: any[] = [];
  PriceList: any[] = [];
  DateList: any[] = [];

  // names for UI
  LanguageNames: string[] = [];
  CategoriesName: string[] = [];
  moreFiltersName: string[] = [];
  priceName: string[] = [];
  dateName: string[] = [];
  filteredMovies: any[] = [];

  // Store selected filters
  selectedFiltersSignal = signal<{ [key: string]: string[] }>({
    Languages: [],
    Categories: [],
    ['More Filters']: [],
    Price: [],
    Date: [],
  });

  dynamicFilterKeys: string[] = ['Languages', 'More Filters', 'Price', 'Date'];

  // Pagination state
  page = 0;
  pageSize = 8;
  totalEvents = 0;
  loading = false;

  constructor(
    private eventService: EventsService,
    public commonService: CommonService,
    private movieService: MovieService
  ) {
    // Watch eventType
    effect(() => {
      const type = this.commonService.eventType();
      if (type) {
        this.fetchLanguages(type);
        this.fetchCategories(type);
        this.fetchMoreFilters(type);
      }
      this.fetchPrices();
      this.fetchDateFilters();
    });
  }

  ngOnInit(): void {
    this.page = 0;
    this.loadEvents();
  }

  /** Load events with filters + pagination */
  loadEvents() {
    if (this.loading) return;
    this.loading = true;

    const currentFilters = this.selectedFiltersSignal();

    const payload = {
      type: 'Event',
      languages: this.getIdsFromNames(currentFilters['Languages'], 'Languages'),
      categories: this.getIdsFromNames(
        currentFilters['Categories'],
        'Categories'
      ),
      morefilter: this.getIdsFromNames(
        currentFilters['More Filters'],
        'MoreFilters'
      ),
      price: this.getIdsFromNames(currentFilters['Price'], 'Price'),
      dateFilters: this.getIdsFromNames(currentFilters['Date'], 'Date'),
    };

    this.movieService
      .getAllMovies(payload, this.page, this.pageSize)
      .subscribe({
        next: (res: any) => {
          const events = res.data?.content || res.events || [];
          if (events.length) {
            this.totalEvents = res.data?.count || 0;
            this.filteredMovies.push(...events);
            this.page++;
          }
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        },
      });
  }

  /** Infinite scroll */
  onScroll(event: any) {
    const isEventsEqualsCount = this.filteredMovies.length === this.totalEvents;
    if (isEventsEqualsCount || this.loading) return;

    this.loadEvents();
  }

  /** Handle filter change */
  onFilterChange(type: string, selected: string[]) {
    this.selectedFiltersSignal.update((prev) => ({
      ...prev,
      [type]: selected,
    }));

    // Reset pagination and data
    this.page = 0;
    this.filteredMovies = [];

    // Reload events with new filters
    this.loadEvents();
  }

  // initial movies
  loadAllMovies(): void {
    const payload = {
      type: 'Event',
      languages: [],
      categories: [],
      morefilter: [],
      price: [],
      dateFilters: [],
    };

    this.movieService.getAllMovies(payload).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.filteredMovies = res.data;
        }
      },
      error: (err) => console.error('Error fetching movies:', err),
    });
  }

  // Date Filters
  /** Helpers to fetch filter data */
  fetchDateFilters() {
    this.eventService.getDateFilters().subscribe({
      next: (res: any) => {
        if (res.success) {
          this.DateList = res.data;
          this.dateName = res.data.map((d: any) => d.dateFilterName);
        }
      },
    });
  }

  // Languages
  fetchLanguages(eventType: string) {
    this.eventService.getLanguages(eventType).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.LanguageList = res.data;
          this.LanguageNames = res.data.map((lang: any) => lang.languageName);
        }
      },
    });
  }

  // Categories
  fetchCategories(eventType: string) {
    this.eventService.getCategories(eventType).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.CategoriesList = res.data;
          this.CategoriesName = res.data.map((c: any) => c.categoryName);
        }
      },
    });
  }

  // More Filters
  fetchMoreFilters(eventType: string) {
    this.eventService.getMoreFilters(eventType).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.MoreFiltersList = res.data;
          this.moreFiltersName = res.data.map((m: any) => m.moreFilterName);
        }
      },
    });
  }

  // Price
  fetchPrices() {
    this.eventService.getPrices().subscribe({
      next: (res: any) => {
        if (res.success) {
          this.PriceList = res.data;
          this.priceName = res.data.map((p: any) => p.priceRange);
        }
      },
    });
  }

  // Helper mapper
  /** Map names → IDs */
  getIdsFromNames(selectedNames: string[], type: string): number[] {
    if (!selectedNames?.length) return [];

    let list: any[] = [];
    let key = '';

    switch (type) {
      case 'Languages':
        list = this.LanguageList;
        key = 'languageId';
        break;
      case 'Categories':
        list = this.CategoriesList;
        key = 'categoryId';
        break;
      case 'Price':
        list = this.PriceList;
        key = 'priceId';
        break;
      case 'MoreFilters':
        list = this.MoreFiltersList;
        key = 'filterId';
        break;
      case 'Date':
        list = this.DateList;
        key = 'dateFilterId';
        break;
    }

    return selectedNames
      .map((name) => {
        const found =
          list.find((item) => item.name === name) ||
          list.find((item) => item.languageName === name) ||
          list.find((item) => item.categoryName === name) ||
          list.find((item) => item.moreFilterName === name) ||
          list.find((item) => item.priceRange === name) ||
          list.find((item) => item.dateFilterName === name);

        return found?.[key];
      })
      .filter((id) => id !== undefined);
  }
}
