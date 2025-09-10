import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
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
import { CommonModule } from '@angular/common';
import { SearchFilterComponent } from './shared/components/search-filter/search-filter.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { LoaderComponent } from './pages/loader/loader.component';
import { httpInterceptor } from './auth/interceptor/http.interceptor';

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
    LoaderComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
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
    BsDropdownModule.forRoot(),
  ],

  exports: [FeatherModule],
  providers: [
    provideHttpClient(withInterceptors([authInterceptor, httpInterceptor])),
    BsModalService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
