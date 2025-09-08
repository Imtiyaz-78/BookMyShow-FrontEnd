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

@NgModule({
  declarations: [UsersComponent, ListYourShowComponent],
  imports: [
    CommonModule,
    AdminAccessRoutingModule,
    CarouselModule,
    ReactiveFormsModule,
    SingleSelectComponent,
    SearchFilterComponent,
  ],
  providers: [BsModalService],
})
export class AdminAccessModule {}
