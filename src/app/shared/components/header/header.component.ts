import {
  Component,
  computed,
  inject,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {
  NgbActiveModal,
  NgbModal,
  NgbModalOptions,
  NgbModalRef,
} from '@ng-bootstrap/ng-bootstrap';
import { cities, citiesJson } from '../../../../../db';
import { CommonService } from '../../../services/common.service';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
export class NgbdModalContent {
  activeModal = inject(NgbActiveModal);
}
@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  @ViewChild('content', { static: true }) content!: TemplateRef<any>;
  @ViewChild('userAuthModal') userAuthModal!: TemplateRef<any>;
  @ViewChild('cityModal') cityModal!: TemplateRef<any>;
  cityData: any[] = [];
  citiesJson: any = null;
  showCities = false;
  selectedCity: any;
  city = false;
  viewCitiesText: string = 'View All Cities';
  showProfileheader: any;
  loadData: boolean = false;

  modalRef: any;
  constructor(
    private modalService: NgbModal,
    public service: CommonService,
    private route: Router,
    private modalSrv: BsModalService,
    private sanitizer: DomSanitizer
  ) {
    this.cityData = cities;
    this.selectedCity = this.service._selectCity();
  }

  ngOnInit(): void {
    this.showProfileheader = this.service._profileHeader();
    if (!this.selectedCity) {
    }
  }

  openModal(cityModal: any): void {
    this.onGetAllCity();
    if (this.loadData) {
      this.modalRef = this.modalSrv.show(cityModal, {
        class: 'modal-dialog-centered width_800',
        keyboard: false,
        ignoreBackdropClick: true,
      });
    }
  }

  viewAllCities() {
    this.showCities = !this.showCities;
    this.viewCitiesText = this.showCities
      ? 'Hide All Cities'
      : 'View All Cities';
    this.citiesJson = this.showCities ? citiesJson : null;
  }

  openLoginModal(userAuthModal: any): void {
    this.modalRef = this.modalSrv.show(userAuthModal, {
      class: 'modal-dialog-centered dialog',
      keyboard: false,
      ignoreBackdropClick: true,
    });
  }

  selectCity(city: any, modalRef: NgbModalRef) {
    this.service._selectCity.set(city);
    this.selectedCity = this.service._selectCity();
    sessionStorage.setItem('selectedCity', JSON.stringify(this.selectedCity));
    if (modalRef) {
      modalRef.close();
    }
  }

  editProfile() {}

  convertBase64ToSafeUrl(imageUrl: string) {
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

  // get all city
  onGetAllCity() {
    this.service.getAllCity().subscribe({
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
}
