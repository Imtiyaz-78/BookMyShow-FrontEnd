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
import { AuthService } from '../../../auth/AuthService/auth.service';
import { ToastService } from '../toast/toast.service';
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
  hideOnLogout: boolean = true;
  filterCityData: any[] = [];
  filterCityList: any[] = [];
  activeMenu: string = '';

  modalRef!: BsModalRef;
  constructor(
    public commonService: CommonService,
    private route: Router,
    private modalSrv: BsModalService,
    private sanitizer: DomSanitizer,
    public authService: AuthService,
    private router: Router,
    private toastService: ToastService
  ) {
    this.selectedCitySignal = this.commonService.selectedCitySignal;

    // Effect runs whenever authService.isLoggedIn() changes
    effect(() => {
      this.isLoggedInSignalValue.set(this.authService.isLoggedIn()); // Read signal value using ()
      this.selectedCity = this.commonService.selectedCitySignal;
    });
  }

  ngOnInit(): void {
    this.showProfileheader = this.commonService.profileHeaderSignal();
    if (!this.selectedCity) {
    }
    this.fetchPopularCities();
    this.fetchAllCities();
    // Restore from sessionStorage on refresh
    const savedMenu = sessionStorage.getItem('eventType');
    if (savedMenu) {
      this.activeMenu = savedMenu;
    }

    // By ubject
    // this.authService.isLoggedIn$.subscribe((status) => {
    //   this.isLoggedIn = status;
    // });

    const userId = this.authService.userDetails().userId;
    this.onGetAllNotifications(userId);
    this.loadUnreadCount(userId);
    console.log('UserId', this.authService.userDetails().userId);

    // Initial fetch
    this.onGetAllNotifications(userId);
    this.loadUnreadCount(userId);

    // Start real-time polling
    this.startNotificationPolling(userId);
  }

  get userProfileDetails() {
    return this.authService.userDetails();
  }

  openCitySelectionModal(modalTemplate: TemplateRef<any>): void {
    this.modalRef = this.modalSrv.show(modalTemplate, {
      class: 'modal-dialog-centered width_800',
      keyboard: false,
      ignoreBackdropClick: true,
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
      class: ' dialog modal-dialog-centered',
      keyboard: true,
      ignoreBackdropClick: false,
    });

    this.hideOnLogout = true;
  }

  handleCitySelection(city: string, modalRef?: BsModalRef): void {
    sessionStorage.setItem('selectedCity', city); // Save city into session storage
    this.commonService.selectedCitySignal.set(city); // Update signal in common service
    this.router.navigate(['explore', 'home', city]);

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
    this.commonService.getAllPopularCity().subscribe({
      next: (res: any) => {
        if (res) {
          if (res.success) {
            this.cityData = res.data;
            this.filterCityData = [...this.cityData];
            if (!this.commonService.selectedCitySignal()) {
              this.openCitySelectionModal(this.cityModal);
            }
          }
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  fetchAllCities(): void {
    this.commonService.getAllCity().subscribe({
      next: (res: any) => {
        if (res) {
          if (res.success) {
            this.cityList = res.data;
            this.filterCityList = [...this.cityList];
          }
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  onLogout(): void {
    this.authService.logout();
    this.hideOnLogout = false;
    this.toastService.startToast({
      message: 'Logged out successfully',
      type: 'success',
    });
    this.router.navigate(['/']);
  }

  // Common search
  onCitySearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    const term = input.value.toLowerCase().trim();
    // debugger;

    this.filterCityData = this.cityData.filter((city) =>
      city.cityName.toLowerCase().includes(term)
    );

    this.filterCityList = this.cityList.filter((city) =>
      city.cityName.toLowerCase().includes(term)
    );
  }

  getActiveMenu(menu: string) {
    this.activeMenu = menu;
  }

  setActiveMenu(menu: string) {
    this.activeMenu = menu;
    this.commonService.setEventType(menu);
    sessionStorage.setItem('eventType', menu);

    // Navigate dynamically
    switch (menu) {
      case 'Movie':
        this.router.navigate(['explore/movies']);
        break;

      case 'Event':
        this.router.navigate(['explore/events']);
        break;

      case 'Plays':
        this.router.navigate(['explore/plays']);
        break;

      case 'Sports':
        this.router.navigate(['explore/sports']);
        break;

      case 'Users':
        this.router.navigate(['/admin/users'], { state: { data: true } });
        break;

      case 'ListYouShow':
        this.router.navigate(['admin/list-your-show']);
        break;

      case 'Venue':
        this.router.navigate(['admin/create-venue']);
        break;

      case 'Content':
        this.router.navigate(['admin/content']);
        break;

      default:
        this.router.navigate([`explore/${menu.toLowerCase()}`]);
        break;
    }
  }

  showNotifications = false;
  notifications: any[] = [];
  notificationCount = 0;

  page = 0;
  size = 4;
  totalCount = 0;
  isLoading = false;
  scrollTimeout: any;
  pollingInterval: any;

  // Toggle notifications dropdown
  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
  }

  // Format notification date
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString();
  }

  // This Method is for to Fetch notifications with pagination
  onGetAllNotifications(userId: number) {
    if (this.isLoading) return;
    this.isLoading = true;

    this.commonService
      .getNotifications(userId, this.page, this.size)
      .subscribe({
        next: (res) => {
          if (res.success) {
            this.totalCount = res.data.count;
            this.notifications = [...this.notifications, ...res.data.content];
          }
          this.isLoading = false;
        },
        error: (err) => {
          this.isLoading = false;
          this.toastService.startToast({
            message: err.message,
            type: 'error',
          });
        },
      });
  }

  // This method is for to Scroll handler with debounce
  onScroll(event: any, userId: number) {
    clearTimeout(this.scrollTimeout);

    this.scrollTimeout = setTimeout(() => {
      const allLoaded = this.notifications.length >= this.totalCount;
      if (allLoaded || this.isLoading) return;

      this.page++;
      this.onGetAllNotifications(userId);
    }, 500);
  }

  // This method is for to Load unread notifications count
  loadUnreadCount(userId: number) {
    this.commonService.getUnreadCount(userId).subscribe({
      next: (res) => {
        if (res.success) {
          this.notificationCount = res.data;
        }
      },
      error: (err) => {
        this.toastService.startToast({
          message: err.message,
          type: 'error',
        });
      },
    });
  }

  // Mark a notification as read
  onMarkAsRead(userId: number, note: any) {
    if (!note || note.read) return;

    this.commonService.markAsRead(userId, note.notificationId).subscribe({
      next: (res) => {
        if (res?.success) {
          note.read = true;
          this.loadUnreadCount(userId);
          this.toastService.startToast({
            message: res.message,
            type: 'success',
          });
        }
      },
      error: (err) => {
        this.toastService.startToast({
          message: err.message,
          type: 'error',
        });
      },
    });
  }

  // Start polling notifications (for real-time updates)
  startNotificationPolling(userId: number, intervalMs: number = 1000) {
    this.pollingInterval = setInterval(() => {
      // Refresh only the first page to check for new notifications
      this.commonService.getNotifications(userId, 0, this.size).subscribe({
        next: (res) => {
          if (res.success) {
            const newNotifications = res.data.content.filter(
              (note: any) =>
                !this.notifications.some(
                  (n) => n.notificationId === note.notificationId
                )
            );
            if (newNotifications.length) {
              this.notifications = [...newNotifications, ...this.notifications];
              this.totalCount = res.data.count;
              this.notificationCount = res.data.count;
            }
          }
        },
      });
    }, intervalMs);
  }

  // This method is for to Stop polling (on component destroy)
  stopNotificationPolling() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
    }
  }

  ngOnDestroy(): void {
    this.stopNotificationPolling();
  }
}
