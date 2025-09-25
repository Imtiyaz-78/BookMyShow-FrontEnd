import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActivitiesListComponent } from './activities-list/activities-list.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'activities-list',
    pathMatch: 'full',
  },

  {
    path: 'activities-list',
    component: ActivitiesListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ActivitiesRoutingModule {}
