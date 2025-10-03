import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminAccessRoutingModule } from './admin-access-routing.module';
import { UsersComponent } from './users/users.component';
import { ListYourShowComponent } from './list-your-show/list-your-show.component';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ReactiveFormsModule } from '@angular/forms';
import { SingleSelectComponent } from '../../shared/components/single-select/single-select.component';
import { SearchFilterComponent } from '../../shared/components/search-filter/search-filter.component';
import { FeatherModule } from 'angular-feather';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ClickOutsideDirective } from '../../shared/directives/click-outside.directive';
import { ContentComponent } from './content/content.component';
import { VenueListComponent } from './venue/venue-list/venue-list.component';

@NgModule({
  declarations: [
    UsersComponent,
    ListYourShowComponent,
    ContentComponent,
    VenueListComponent,
  ],
  imports: [
    CommonModule,
    AdminAccessRoutingModule,
    CarouselModule,
    ReactiveFormsModule,
    SingleSelectComponent,
    SearchFilterComponent,
    FeatherModule,
    BsDropdownModule,
    ClickOutsideDirective,
    ReactiveFormsModule,
  ],
  providers: [BsModalService],
})
export class AdminAccessModule {}
