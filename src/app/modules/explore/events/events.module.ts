import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EventsRoutingModule } from './events-routing.module';
import { TruncatePipe } from '../../../shared/pipes/truncate.pipe';
import { FilterAccordianComponent } from '../../../shared/components/filter-accordian/filter-accordian.component';
import { EventHomeComponent } from './event-home/event-home.component';

@NgModule({
  declarations: [EventHomeComponent],
  imports: [
    CommonModule,
    EventsRoutingModule,
    FilterAccordianComponent,
    TruncatePipe,
  ],
})
export class EventsModule {}
