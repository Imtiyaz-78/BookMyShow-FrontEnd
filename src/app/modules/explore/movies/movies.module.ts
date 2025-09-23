import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MoviesRoutingModule } from './movies-routing.module';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { TruncatePipe } from '../../../shared/pipes/truncate.pipe';
import { FilterAccordianComponent } from '../../../shared/components/filter-accordian/filter-accordian.component';
import { UpcommingMoviesComponent } from './upcomming-movies/upcomming-movies.component';
import { MovieComponent } from './movie/movie.component';
import { FeatherModule } from 'angular-feather';
import { NumberSuffixPipe } from '../../../core/pipe/number-suffix.pipe';

@NgModule({
  declarations: [MovieComponent, UpcommingMoviesComponent],
  imports: [
    CommonModule,
    MoviesRoutingModule,
    CarouselModule,
    TruncatePipe,
    FilterAccordianComponent,
    FeatherModule,
    NumberSuffixPipe,
  ],
})
export class MoviesModule {}
