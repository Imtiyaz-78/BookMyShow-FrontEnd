import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { TruncatePipe } from '../../../shared/pipes/truncate.pipe';
import { FeatherModule } from 'angular-feather';
import { LandingPageComponent } from './landingpage/landingpage.component';

@NgModule({
  declarations: [LandingPageComponent],
  imports: [
    CommonModule,
    HomeRoutingModule,
    CarouselModule,
    TruncatePipe,
    FeatherModule,
  ],
})
export class HomeModule {}
