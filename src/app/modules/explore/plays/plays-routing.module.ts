import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlaysListComponent } from './plays-list/plays-list.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'plays-list',
    pathMatch: 'full',
  },

  {
    path: 'plays-list',
    component: PlaysListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlaysRoutingModule {}
