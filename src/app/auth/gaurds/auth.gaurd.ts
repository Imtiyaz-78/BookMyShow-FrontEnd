// import { CanActivateFn } from '@angular/router';

// export const authGaurd: CanActivateFn = (route, state) => {
//   return true;
// };

import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../AuthService/auth.service';
import { ToastService } from '../../shared/components/toast/toast.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private auth: AuthService,
    private router: Router,
    private toast: ToastService
  ) {}

  canActivate(): boolean {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded: any = this.auth.decodeToken(token);
      if (decoded && decoded.exp) {
        const expDate = new Date(decoded.exp * 1000);
        console.log('Token expires at:', expDate.toLocaleString());
      }
    }
    if (this.auth.isTokenExpired()) {
      this.auth.logout();
      this.toast.startToast('Your session has expired. Please login again.');
      this.router.navigate(['/']);
      return false;
    }
    return true;
  }
}
