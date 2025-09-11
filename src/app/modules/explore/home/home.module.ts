import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './landingpage/landingpage.component';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { TruncatePipe } from '../../../shared/pipes/truncate.pipe';
import { FeatherModule } from 'angular-feather';

@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    HomeRoutingModule,
    CarouselModule,
    TruncatePipe,
    FeatherModule,
  ],
})
export class HomeModule {}
