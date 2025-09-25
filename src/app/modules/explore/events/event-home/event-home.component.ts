import { Component, effect, OnInit, signal } from '@angular/core';
import { movies } from '../../../../../../db';
import { CommonService } from '../../../../services/common.service';
import { MovieService } from '../../../../services/movie.service';
import { EventsService } from '../service/events.service';

@Component({
  selector: 'app-event-home',
  standalone: false,
  templateUrl: './event-home.component.html',
  styleUrl: './event-home.component.scss',
})
export class EventHomeComponent implements OnInit {
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
    this.loadAllMovies();
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
  fetchDateFilters() {
    this.eventService.getDateFilters().subscribe({
      next: (res: any) => {
        if (res.success) {
          this.DateList = res.data;
          this.dateName = res.data.map((d: any) => d.dateFilterName);
          if (!this.selectedFiltersSignal()['Date']?.length) {
            this.selectedFiltersSignal.update((prev) => ({
              ...prev,
              Date: [],
            }));
          }
        }
      },
      error: (err) => console.error(err),
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

  // Common filter handler
  onFilterChange(type: string, selected: string[]) {
    this.selectedFiltersSignal.update((prev) => ({
      ...prev,
      [type]: selected,
    }));

    const currentFilters = this.selectedFiltersSignal();

    const payload = {
      type: this.commonService.eventType() || 'Event',
      languages: this.getIdsFromNames(currentFilters['Languages'], 'Languages'),
      categories: this.getIdsFromNames(
        currentFilters['Categories'],
        'Categories'
      ),
      price: this.getIdsFromNames(currentFilters['Price'], 'Price'),
      morefilter: this.getIdsFromNames(
        currentFilters['More Filters'],
        'MoreFilters'
      ),
      dateFilters: this.getIdsFromNames(currentFilters['Date'], 'Date'),
    };

    console.log('Final Filter Payload:', payload);

    this.movieService.applyFilters(payload).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.filteredMovies = res.data;
        }
      },
      error: (err) => console.error('Filter API error:', err),
    });
  }

  // Helper mapper
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
        const found = list.find(
          (item) =>
            item.name === name ||
            item[`${type.toLowerCase()}Name`] === name ||
            item.dateFilterName === name
        );
        return found?.[key];
      })
      .filter((id) => id !== undefined);
  }
}
