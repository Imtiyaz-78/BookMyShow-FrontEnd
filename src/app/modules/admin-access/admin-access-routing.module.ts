import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersComponent } from './users/users.component';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { ListYourShowComponent } from './list-your-show/list-your-show.component';
import { VenueListComponent } from './venue/venue-list/venue-list.component';
import { CreateVenueComponent } from './venue/create-venue/create-venue.component';
import { ContentListComponent } from './venue/content/content-list/content-list.component';

const routes: Routes = [
  { path: '', redirectTo: 'list-your-show', pathMatch: 'full' },
  {
    path: 'list-your-show',
    component: ListYourShowComponent,
  },
  {
    path: 'users',
    component: UsersComponent,
  },
  {
    path: 'create-venue',
    component: CreateVenueComponent,
  },
  {
    path: 'venue-list',
    component: VenueListComponent,
  },
  {
    path: 'content',
    component: ContentListComponent,
  },

  {
    path: 'ceate-content',
    component: ContentListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminAccessRoutingModule {}
