import {
  AfterViewInit,
  Component,
  effect,
  OnInit,
  signal,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { AuthService, UserToken } from '../../../auth/AuthService/auth.service';
@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @ViewChild('content', { static: true }) content!: TemplateRef<any>;
  @ViewChild('userAuthModal') userAuthModal!: TemplateRef<any>;
  @ViewChild('cityModal') cityModal!: TemplateRef<any>;
  cityData: any[] = [];
  cityList: any[] = [];
  showCities = false;
  selectedCity: any;
  city = false;
  viewCitiesText: string = 'View All Cities';
  showProfileheader: any;
  loadData: boolean = false;
  selectedCitySignal: any;
  isLoggedIn = false;
  isLoggedInSignalValue = signal(false);
  userProfileDetails = signal<UserToken | null>(null);
  hideOnLogout: boolean = true;
  filterCityData: any[] = [];
  filterCityList: any[] = [];

  modalRef!: BsModalRef;
  constructor(
    public service: CommonService,
    private route: Router,
    private modalSrv: BsModalService,
    private sanitizer: DomSanitizer,
    public authService: AuthService
  ) {
    this.selectedCitySignal = this.service.selectedCitySignal;

    // Effect runs whenever authService.isLoggedIn() changes
    effect(() => {
      this.isLoggedInSignalValue.set(this.authService.isLoggedIn());
      this.userProfileDetails.set(this.authService.userDetails());
    });
  }

  ngOnInit(): void {
    this.showProfileheader = this.service.profileHeaderSignal();
    if (!this.selectedCity) {
    }
    this.fetchPopularCities();
    this.fetchAllCities();

    // By ubject
    // this.authService.isLoggedIn$.subscribe((status) => {
    //   this.isLoggedIn = status;
    // });
  }

  openCitySelectionModal(modalTemplate: TemplateRef<any>): void {
    this.modalRef = this.modalSrv.show(modalTemplate, {
      class: 'modal-dialog-centered width_800',
      keyboard: true,
      ignoreBackdropClick: false,
    });
  }

  toggleCityListVisibility(): void {
    this.showCities = !this.showCities;
    this.viewCitiesText = this.showCities
      ? 'Hide All Cities'
      : 'View All Cities';

    // this.fetchAllCities();
  }

  openAuthModal(authModalTemplate: TemplateRef<any>): void {
    this.modalRef = this.modalSrv.show(authModalTemplate, {
      class: ' dialog',
      keyboard: true,
      ignoreBackdropClick: false,
    });

    this.hideOnLogout = true;
  }

  handleCitySelection(city: string, modalRef?: BsModalRef): void {
    this.selectedCity = city;
    this.service.selectedCitySignal.set(city);
    if (modalRef) {
      modalRef.hide();
    }
  }

  editProfile() {}

  // Formating image
  getImageFromBase64(base64string: string): any {
    if (base64string) {
      let imageType = base64string;

      const fullBase64String = `data:${imageType};base64,${base64string}`;
      return this.sanitizer.bypassSecurityTrustUrl(fullBase64String);
    }
  }

  // get all popular city
  fetchPopularCities(): void {
    this.service.getAllPopularCity().subscribe({
      next: (res: any) => {
        if (res) {
          this.cityData = res;
          this.filterCityData = [...this.cityData];
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  fetchAllCities(): void {
    this.service.getAllCity().subscribe({
      next: (res: any) => {
        if (res) {
          this.cityList = res;
          this.filterCityList = [...this.cityList];
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  logout(): void {
    this.authService.logout();
    this.hideOnLogout = false;
  }

  // Common search
  onCitySearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    const term = input.value.toLowerCase().trim();

    this.filterCityData = this.cityData.filter((city) =>
      city.name.toLowerCase().includes(term)
    );

    this.filterCityList = this.cityList.filter((city) =>
      city.name.toLowerCase().includes(term)
    );
  }
}
