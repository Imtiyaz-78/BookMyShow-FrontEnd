import { Component, effect, signal } from '@angular/core';
import { movies } from '../../../../../../db';
import { CommonService } from '../../../../services/common.service';
import { MovieService } from '../../../../services/movie.service';

@Component({
  selector: 'app-movie',
  standalone: false,
  templateUrl: './movie.component.html',
  styleUrl: './movie.component.scss',
})
export class MovieComponent {
  dummyMoviesdata: any[] = [];
  dummyMoviesdatafiltered: any[] = [];
  originalMovies = movies;
  LanguageList: string[] = [];
  GenresList: string[] = ['Action', 'Comedy', 'Drama'];
  FormatList: string[] = ['2D', '3D', 'IMAX'];

  // Store selected filters for all categories
  selectedFiltersSignal = signal<{ [key: string]: string[] }>({
    Languages: [],
    Genres: [],
    Format: [],
  });

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

  // Fetch Language
  fetchLanguages(eventType: string) {
    this.movieService.getLanguagesByEventType(eventType).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.LanguageList = res.data.map((lang: any) => lang.languageName);

          // Set default selected filters for Languages if needed
          if (!this.selectedFiltersSignal()['Languages']?.length) {
            this.selectedFiltersSignal.update((prev) => ({
              ...prev,
              ['Languages']: [],
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
          this.GenresList = res.data.map((genre: any) => genre.genresName);

          if (!this.selectedFiltersSignal()['Genres']?.length) {
            this.selectedFiltersSignal.update((prev) => ({
              ...prev,
              ['Genres']: [],
            }));
          }
        }
      },
      error: (err) => console.error(err),
    });
  }

  fetchFormats() {
    this.movieService.getFormats().subscribe({
      next: (res: any) => {
        if (res.success) {
          // assuming res.data is an array of format objects with formatName
          this.FormatList = res.data.map((f: any) => f.formatName);

          // Initialize selectedFiltersSignal if needed
          if (!this.selectedFiltersSignal()['Format']?.length) {
            this.selectedFiltersSignal.update((prev) => ({
              ...prev,
              Format: [],
            }));
          }
        }
      },
      error: (err) => console.error('Failed to fetch formats:', err),
    });
  }

  // Called when a filter is clicked in any accordion
  onFilterChange(category: string, selected: string[]) {
    this.selectedFiltersSignal.update((prev) => ({
      ...prev,
      [category]: selected,
    }));

    this.callApiForFilter(category, selected);
  }

  callApiForFilter(category: string, filters: string[]) {
    // Example: only call if filters length > 0
    if (filters.length) {
      console.log(`Call API for ${category}:`, filters);
      // TODO: implement actual API call based on category and selected filters
    }
  }
}
