import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './shared/components/header/header.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { SearcboxComponent } from './shared/components/searcbox/searcbox.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UserAuthComponent } from './auth/user-auth/user-auth.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ErrorpageComponent } from './shared/components/erorpage/errorpage.component';
import { FilterAccordianComponent } from './shared/components/filter-accordian/filter-accordian.component';
import { MoviesDetailsComponent } from './shared/components/movies-details/movies-details.component';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { FeatherModule } from 'angular-feather';
import { allIcons } from 'angular-feather/icons';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './auth/interceptor/auth.interceptor';
import { BsModalService } from 'ngx-bootstrap/modal';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { ToastComponent } from './shared/components/toast/toast.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    SearcboxComponent,
    // UserAuthComponent,
    ErrorpageComponent,
    MainLayoutComponent,
    ToastComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    ReactiveFormsModule,
    FormsModule,
    FilterAccordianComponent,
    MoviesDetailsComponent,
    CarouselModule,
    FeatherModule,
    FeatherModule.pick(allIcons),
    UserAuthComponent,
  ],

  exports: [FeatherModule],
  providers: [
    provideHttpClient(withInterceptors([authInterceptor])),
    BsModalService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
