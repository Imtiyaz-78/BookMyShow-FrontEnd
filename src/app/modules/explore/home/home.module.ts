import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { TruncatePipe } from '../../../shared/pipes/truncate.pipe';
import { FeatherModule } from 'angular-feather';
import { HomeLandingPageComponent } from './home-landing-page/home-landing-page.component';
import { NumberSuffixPipe } from '../../../core/pipe/number-suffix.pipe';

@NgModule({
  declarations: [HomeLandingPageComponent],
  imports: [
    CommonModule,
    HomeRoutingModule,
    CarouselModule,
    TruncatePipe,
    FeatherModule,
    NumberSuffixPipe,
  ],
})
export class HomeModule {}
