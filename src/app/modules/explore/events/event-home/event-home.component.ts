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
  GenresList: any[] = [];
  FormatList: any[] = [];
  DateList: any[] = [];
  CategoriesList: any[] = [];
  MoreFiltersList: any[] = [];
  PriceList: any[] = [];
  TagsList: any[] = [];
  ReleaseMonthsList: any[] = [];

  // names for UI
  LanguageNames: string[] = [];
  GenreNames: string[] = [];
  FormatNames: string[] = [];
  dateName: string[] = [];
  CategoriesName: string[] = [];
  moreFiltersName: string[] = [];
  priceName: string[] = [];
  tagsName: string[] = [];
  releaseMonthsName: string[] = [];

  filteredMovies: any[] = [];

  // Store selected filters for all categories
  selectedFiltersSignal = signal<{ [key: string]: string[] }>({
    Languages: [],
    Genres: [],
    Formats: [],
    Date: [],
    Categories: [],
    ['More Filters']: [],
    Price: [],
    Tags: [],
    ReleaseMonths: [],
  });

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
        this.fetchGenres(type);
        this.fetchFormats(type);
        this.fetchCategories(type);
        this.fetchMoreFilters(type);
      }
      this.fetchTags();
      this.fetchReleaseMonths();
      this.fetchPrices();
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
      genres: [],
      formats: [],
      tags: [],
      categories: [],
      price: [],
      morefilter: [],
      releaseMonths: [],
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

  // Tags
  fetchTags() {
    this.eventService.getTags().subscribe({
      next: (res: any) => {
        if (res.success) {
          this.TagsList = res.data;
          this.tagsName = res.data.map((t: any) => t.tagName);
        }
      },
    });
  }

  // filters by months
  fetchReleaseMonths() {
    this.eventService.getReleaseMonths().subscribe({
      next: (res: any) => {
        if (res.success) {
          this.ReleaseMonthsList = res.data;
          this.releaseMonthsName = res.data.map((r: any) => r.releaseMonthName); // ✅ Corrected
          if (!this.selectedFiltersSignal()['ReleaseMonths']?.length) {
            this.selectedFiltersSignal.update((prev) => ({
              ...prev,
              ReleaseMonths: [],
            }));
          }
        }
      },
      error: (err) => console.error(err),
    });
  }

  // By Formats
  fetchFormats(eventType: string) {
    this.eventService.getFormats(eventType).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.FormatList = res.data;
          this.FormatNames = res.data.map((f: any) => f.formatName);
        }
      },
    });
  }

  // By Genres
  fetchGenres(eventType: string) {
    this.eventService.getGenres(eventType).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.GenresList = res.data;
          this.GenreNames = res.data.map((g: any) => g.genresName);
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
          if (!this.selectedFiltersSignal()['Languages']?.length) {
            this.selectedFiltersSignal.update((prev) => ({
              ...prev,
              Languages: [],
            }));
          }
        }
      },
      error: (err) => console.error(err),
    });
  }

  // Categories
  fetchCategories(eventType: string) {
    this.eventService.getCategories(eventType).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.CategoriesList = res.data;
          this.CategoriesName = res.data.map((c: any) => c.categoryName);
          if (!this.selectedFiltersSignal()['Categories']?.length) {
            this.selectedFiltersSignal.update((prev) => ({
              ...prev,
              Categories: [],
            }));
          }
        }
      },
      error: (err) => console.error(err),
    });
  }

  // More Filters
  fetchMoreFilters(eventType: string) {
    this.eventService.getMoreFilters(eventType).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.MoreFiltersList = res.data;
          this.moreFiltersName = res.data.map((m: any) => m.moreFilterName); // ✅ Corrected
          if (!this.selectedFiltersSignal()['More Filters']?.length) {
            this.selectedFiltersSignal.update((prev) => ({
              ...prev,
              ['More Filters']: [],
            }));
          }
        }
      },
      error: (err) => console.error(err),
    });
  }

  // Price
  fetchPrices() {
    this.eventService.getPrices().subscribe({
      next: (res: any) => {
        if (res.success) {
          this.PriceList = res.data;
          this.priceName = res.data.map((p: any) => p.priceRange); // ✅ Corrected
          if (!this.selectedFiltersSignal()['Price']?.length) {
            this.selectedFiltersSignal.update((prev) => ({
              ...prev,
              Price: [],
            }));
          }
        }
      },
      error: (err) => console.error(err),
    });
  }

  //  Common filter handler
  onFilterChange(type: string, selected: string[]) {
    this.selectedFiltersSignal.update((prev) => ({
      ...prev,
      [type]: selected,
    }));

    const currentFilters = this.selectedFiltersSignal();

    const payload = {
      type: this.commonService.eventType() || 'Event',
      languages: this.getIdsFromNames(currentFilters['Languages'], 'Languages'),
      genres: this.getIdsFromNames(currentFilters['Genres'], 'Genres'),
      formats: this.getIdsFromNames(currentFilters['Formats'], 'Formats'),
      tags: this.getIdsFromNames(currentFilters['Tags'], 'Tags'),
      categories: this.getIdsFromNames(
        currentFilters['Categories'],
        'Categories'
      ),
      price: this.getIdsFromNames(currentFilters['Price'], 'Price'),
      morefilter: this.getIdsFromNames(
        currentFilters['More Filters'],
        'MoreFilters'
      ),
      releaseMonths: this.getIdsFromNames(
        currentFilters['ReleaseMonths'],
        'ReleaseMonths'
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

  // helper mapper (adjust keys as per backend)
  getIdsFromNames(selectedNames: string[], type: string): number[] {
    if (!selectedNames?.length) return [];

    let list: any[] = [];
    let key = '';

    switch (type) {
      case 'Languages':
        list = this.LanguageList;
        key = 'languageId';
        break;
      case 'Genres':
        list = this.GenresList;
        key = 'genreId';
        break;
      case 'Formats':
        list = this.FormatList;
        key = 'formatId';
        break;
      case 'Tags':
        list = this.TagsList;
        key = 'tagId';
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
      case 'ReleaseMonths':
        list = this.ReleaseMonthsList;
        key = 'monthId';
        break;
      case 'Date':
        list = this.DateList;
        key = 'dateId';
        break;
    }

    return selectedNames
      .map((name) => {
        const found = list.find(
          (item) =>
            item.name === name || item[`${type.toLowerCase()}Name`] === name
        );
        return found?.[key];
      })
      .filter((id) => id !== undefined);
  }
}
