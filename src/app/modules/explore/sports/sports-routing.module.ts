import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SportsListComponent } from './sports-list/sports-list.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'sports-list',
    pathMatch: 'full',
  },
  {
    path: 'sports-list',
    component: SportsListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SportsRoutingModule {}
