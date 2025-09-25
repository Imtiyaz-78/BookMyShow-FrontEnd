import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlaysRoutingModule } from './plays-routing.module';
import { PlaysListComponent } from './plays-list/plays-list.component';


@NgModule({
  declarations: [
    PlaysListComponent
  ],
  imports: [
    CommonModule,
    PlaysRoutingModule
  ]
})
export class PlaysModule { }
