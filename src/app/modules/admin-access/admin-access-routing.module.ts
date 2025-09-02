import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersComponent } from './users/users.component';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { ListYourShowComponent } from './list-your-show/list-your-show.component';

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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminAccessRoutingModule {}
