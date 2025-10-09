import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminAccessRoutingModule } from './admin-access-routing.module';
import { UsersComponent } from './users/users.component';
import { ListYourShowComponent } from './list-your-show/list-your-show.component';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { BsModalService } from 'ngx-bootstrap/modal';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SingleSelectComponent } from '../../shared/components/single-select/single-select.component';
import { SearchFilterComponent } from '../../shared/components/search-filter/search-filter.component';
import { FeatherModule } from 'angular-feather';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ClickOutsideDirective } from '../../shared/directives/click-outside.directive';
import { VenueListComponent } from './venue/venue-list/venue-list.component';
import { CreateVenueComponent } from './venue/create-venue/create-venue.component';
import { ContentListComponent } from './venue/content/content-list/content-list.component';
import { CreateContentComponent } from './venue/content/create-content/create-content.component';
import { NumberSuffixPipe } from '../../core/pipe/number-suffix.pipe';

@NgModule({
  declarations: [
    UsersComponent,
    ListYourShowComponent,
    ContentListComponent,
    VenueListComponent,
    CreateVenueComponent,
    ContentListComponent,
    CreateContentComponent,
  ],
  imports: [
    CommonModule,
    AdminAccessRoutingModule,
    CarouselModule,
    FormsModule,
    ReactiveFormsModule,
    SingleSelectComponent,
    SearchFilterComponent,
    FeatherModule,
    BsDropdownModule,
    ClickOutsideDirective,
    NumberSuffixPipe,
  ],
  providers: [BsModalService],
})
export class AdminAccessModule {}
