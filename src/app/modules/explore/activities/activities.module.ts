import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ActivitiesRoutingModule } from './activities-routing.module';
import { ActivitiesListComponent } from './activities-list/activities-list.component';
import { FeatherModule } from 'angular-feather';
import { FilterAccordianComponent } from '../../../shared/components/filter-accordian/filter-accordian.component';
import { NumberSuffixPipe } from '../../../core/pipe/number-suffix.pipe';

@NgModule({
  declarations: [ActivitiesListComponent],
  imports: [
    CommonModule,
    ActivitiesRoutingModule,
    FeatherModule,
    FilterAccordianComponent,
    NumberSuffixPipe,
  ],
})
export class ActivitiesModule {}
