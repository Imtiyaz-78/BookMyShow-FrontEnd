import { Component } from '@angular/core';
import { CommonService } from '../../../../services/common.service';
import { movies } from '../../../../../../db';

@Component({
  selector: 'app-landingpage',
  standalone: false,
  templateUrl: './landingpage.component.html',
  styleUrl: './landingpage.component.scss',
})
export class LandingpageComponent {
  dummyMoviesdata: any[] = [];
  dummyMoviesdatafiltered: any[] = [];
  originalMovies = movies;
  languaageArray: any[] = [
    'Hindi',
    'English',
    'Malyalam',
    'Gujrati',
    'Panjabi',
  ];

  selectedLanguages: string[] = [];

  constructor(public commonService: CommonService) {
    this.dummyMoviesdata = movies;
  }

  onLanguagesFilterChange(selected: string[]): void {
    selected.forEach((item) => {
      if (!this.selectedLanguages.includes(item)) {
        this.selectedLanguages.push(item); // naye item push karo
      }
    });

    // remove items jo filter mein se unselect ho gaye
    this.selectedLanguages = this.selectedLanguages.filter((item) =>
      selected.includes(item)
    );

    // sort A-Z
    this.selectedLanguages = [...this.selectedLanguages].sort((a, b) =>
      a.localeCompare(b)
    );
  }
}
