import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { AuthService } from '../../../auth/AuthService/auth.service';
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

  modalRef!: BsModalRef;
  constructor(
    public service: CommonService,
    private route: Router,
    private modalSrv: BsModalService,
    private sanitizer: DomSanitizer,
    private authService: AuthService
  ) {
    this.selectedCitySignal = this.service.selectedCitySignal;
  }

  ngOnInit(): void {
    this.showProfileheader = this.service.profileHeaderSignal();
    if (!this.selectedCity) {
    }
    this.fetchPopularCities();
    this.fetchAllCities();
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
  }

  openAuthModal(authModalTemplate: TemplateRef<any>): void {
    this.modalRef = this.modalSrv.show(authModalTemplate, {
      class: 'modal-dialog-centered dialog',
      keyboard: true,
      ignoreBackdropClick: false,
    });
  }

  handleCitySelection(city: any, modalRef?: BsModalRef): void {
    this.service.selectedCitySignal.set(city);
    this.selectedCity = this.service.selectedCitySignal();
    if (modalRef) {
      modalRef.hide();
    }
  }

  editProfile() {}

  convertBase64ToSafeUrl(imageUrl: string): SafeUrl {
    let imgData = imageUrl;
    if (imgData.startsWith('"') && imgData.endsWith('"')) {
      imgData = imgData.slice(1, -1);
    }
    // Remove outer curly braces
    if (imgData.startsWith('{') && imgData.endsWith('}')) {
      imgData = imgData.slice(1, -1);
    }

    try {
      const parsed = JSON.parse(imgData);
      imgData = typeof parsed === 'string' ? parsed : imgData;
    } catch (e) {}
    return this.sanitizer.bypassSecurityTrustUrl(imgData);
  }

  // get all popular city
  fetchPopularCities(): void {
    this.service.getAllPopularCity().subscribe({
      next: (res: any) => {
        if (res) {
          this.cityData = res.map((city: any) => ({
            ...city,
            safeImageUrl: this.convertBase64ToSafeUrl(city.imageUrl),
          }));
          this.loadData = true;
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
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  logout(): void {
    this.authService.logout();
  }
}
