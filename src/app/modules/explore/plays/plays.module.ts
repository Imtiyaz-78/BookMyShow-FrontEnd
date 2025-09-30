import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlaysRoutingModule } from './plays-routing.module';
import { PlaysListComponent } from './plays-list/plays-list.component';
import { FeatherModule } from 'angular-feather';
import { FilterAccordianComponent } from '../../../shared/components/filter-accordian/filter-accordian.component';
import { NumberSuffixPipe } from '../../../core/pipe/number-suffix.pipe';

@NgModule({
  declarations: [PlaysListComponent],
  imports: [
    CommonModule,
    PlaysRoutingModule,
    FeatherModule,
    FilterAccordianComponent,
    NumberSuffixPipe,
  ],
})
export class PlaysModule {}
