import { Component, effect, OnInit, signal } from '@angular/core';
import { movies } from '../../../../../../db';
import { CommonService } from '../../../../services/common.service';
import { MovieService } from '../../../../services/movie.service';

@Component({
  selector: 'app-movie',
  standalone: false,
  templateUrl: './movie.component.html',
  styleUrl: './movie.component.scss',
})
export class MovieComponent implements OnInit {
  dummyMoviesdata: any[] = [];
  dummyMoviesdatafiltered: any[] = [];
  originalMovies = movies;
  LanguageList: any[] = [];
  GenresList: any[] = [];
  FormatList: any[] = [];
  filteredMovies: any[] = [];

  // Display-only arrays for template
  LanguageNames: string[] = [];
  GenreNames: string[] = [];
  FormatNames: string[] = [];

  // Store selected filters for all categories
  selectedFiltersSignal = signal<{ [key: string]: string[] }>({
    Languages: [],
    Genres: [],
    Format: [],
  });
  countMovies: number = 0;

  constructor(
    public commonService: CommonService,
    private movieService: MovieService
  ) {
    this.dummyMoviesdata = movies;

    // Watch eventType
    effect(() => {
      const type = this.commonService.eventType();
      if (type) {
        this.fetchLanguages(type);
        this.fetchGenres(type);
        this.fetchFormats();
      }
    });
  }

  allMovies: any[] = [];
  page = 0;
  pageSize = 8;
  loading = false;
  payload = {};

  ngOnInit(): void {
    this.page = 0;
    this.loadMovies();
  }

  // Load movies from API
  loadMovies() {
    if (this.loading) return;
    this.loading = true;

    const payload = {
      type: this.commonService.eventType() || 'Movie',
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

    this.movieService
      .getAllMovies(payload, this.page, this.pageSize)
      .subscribe({
        next: (res: any) => {
          const movies = res.movies || res.data?.content || [];
          if (movies.length) {
            this.totalMovies = res.data?.count || 0;
            this.filteredMovies.push(...movies);
            this.page++;
          }
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        },
      });
  }

  onScroll(event: any) {
    let isMoviesEqualsCount = this.filteredMovies.length === this.totalMovies;
    if (isMoviesEqualsCount) return;
    console.log(`total count`, this.totalMovies, this.filteredMovies.length);

    this.loadMovies(); // load next page
  }

  totalMovies: number = 0;

  loadAllMovies(page: number = 0, size: number = 5, filterPayload?: any): void {
    // If no filter provided, sending default payload
    const payload = filterPayload || {
      type: 'Movie',
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

    this.movieService.getAllMovies(payload, page, size).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.filteredMovies = Array.isArray(res.data?.content)
            ? res.data.content
            : [];

          this.totalMovies = res.data?.count || 0;
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  // Fetch Languages
  fetchLanguages(eventType: string) {
    this.movieService.getLanguagesByEventType(eventType).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.LanguageList = res.data;
          this.LanguageNames = res.data.map((lang: any) => lang.languageName); // only names for UI
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

  // Fetch Genres
  fetchGenres(eventType: string) {
    this.movieService.getGenresByEventType(eventType).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.GenresList = res.data;
          this.GenreNames = res.data.map((g: any) => g.genresName);
          if (!this.selectedFiltersSignal()['Genres']?.length) {
            this.selectedFiltersSignal.update((prev) => ({
              ...prev,
              Genres: [],
            }));
          }
        }
      },
      error: (err) => console.error(err),
    });
  }

  // Fetch Formats
  fetchFormats() {
    this.movieService.getFormats().subscribe({
      next: (res: any) => {
        if (res.success) {
          this.FormatList = res.data;
          this.FormatNames = res.data.map((f: any) => f.formatName);
          if (!this.selectedFiltersSignal()['Format']?.length) {
            this.selectedFiltersSignal.update((prev) => ({
              ...prev,
              Format: [],
            }));
          }
        }
      },
      error: (err) => console.error(err),
    });
  }

  // Handle filter change from accordion
  onFilterChange(type: 'Languages' | 'Genres' | 'Formats', selected: string[]) {
    // Update signal
    this.selectedFiltersSignal.update((prev) => ({
      ...prev,
      [type]: selected,
    }));

    const currentFilters = this.selectedFiltersSignal();

    // Prepare payload with filters
    const payload = {
      type: this.commonService.eventType() || 'Movie',
      languages: this.getIdsFromNames(currentFilters['Languages'], 'Languages'),
      genres: this.getIdsFromNames(currentFilters['Genres'], 'Genres'),
      formats: this.getIdsFromNames(currentFilters['Formats'], 'Formats'),
      tags: [],
      categories: [],
      price: [],
      morefilter: [],
      releaseMonths: [],
      dateFilters: [],
    };

    this.loadAllMovies(0, 5, payload);
  }

  // Map names to IDs correctly
  getIdsFromNames(
    selectedNames: string[],
    type: 'Languages' | 'Genres' | 'Formats'
  ): number[] {
    if (!selectedNames?.length) return [];

    return selectedNames
      .map((name) => {
        let found: any;
        if (type === 'Languages')
          found = this.LanguageList.find(
            (l) => l.languageName === name || l.name === name
          );
        else if (type === 'Genres')
          found = this.GenresList.find(
            (g) => g.genresName === name || g.name === name
          );
        else if (type === 'Formats')
          found = this.FormatList.find(
            (f) => f.formatName === name || f.name === name
          );

        //  check actual keys from API
        return (
          found?.languageId || found?.genreId || found?.formatId || found?.id
        );
      })
      .filter((id) => id !== undefined);
  }
}
