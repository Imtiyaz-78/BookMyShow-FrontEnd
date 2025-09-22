import { Component, effect } from '@angular/core';
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

  constructor(
    public commonService: CommonService,
    private movieService: MovieService
  ) {
    this.dummyMoviesdata = movies;

    effect(() => {
      const type = this.commonService.eventType();
      if (type) {
        this.fetchLanguages(type);
      }
    });
  }

  fetchLanguages(eventType: string) {
    this.movieService.getLanguagesByEventType(eventType).subscribe({
      next: (res) => {
        if (res.success) {
          this.LanguageList = res.data.map((lang: any) => lang.languageName);
        }
      },
      error: (err) => {
        console.error('Failed to load languages:', err);
      },
    });
  }

  onLanguageFilterChange(selectedLanguages: string[]) {
    console.log('Selected Languages:', selectedLanguages);
    // You can filter your movies here based on selectedLanguages
  }
}
