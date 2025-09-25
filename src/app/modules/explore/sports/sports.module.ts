import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SportsRoutingModule } from './sports-routing.module';
import { SportsListComponent } from './sports-list/sports-list.component';


@NgModule({
  declarations: [
    SportsListComponent
  ],
  imports: [
    CommonModule,
    SportsRoutingModule
  ]
})
export class SportsModule { }
