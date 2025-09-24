import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EventsRoutingModule } from './events-routing.module';
import { TruncatePipe } from '../../../shared/pipes/truncate.pipe';
import { FilterAccordianComponent } from '../../../shared/components/filter-accordian/filter-accordian.component';
import { EventHomeComponent } from './event-home/event-home.component';
import { FeatherModule } from 'angular-feather';
import { NumberSuffixPipe } from '../../../core/pipe/number-suffix.pipe';

@NgModule({
  declarations: [EventHomeComponent],
  imports: [
    CommonModule,
    EventsRoutingModule,
    FilterAccordianComponent,
    TruncatePipe,
    FeatherModule,
    NumberSuffixPipe,
  ],
})
export class EventsModule {}
