import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SportsRoutingModule } from './sports-routing.module';
import { SportsListComponent } from './sports-list/sports-list.component';
import { FeatherModule } from 'angular-feather';
import { FilterAccordianComponent } from '../../../shared/components/filter-accordian/filter-accordian.component';
import { NumberSuffixPipe } from '../../../core/pipe/number-suffix.pipe';
import { CarouselModule } from 'ngx-bootstrap/carousel';

@NgModule({
  declarations: [SportsListComponent],
  imports: [
    CommonModule,
    SportsRoutingModule,
    FeatherModule,
    FilterAccordianComponent,
    NumberSuffixPipe,
    CarouselModule,
  ],
})
export class SportsModule {}
