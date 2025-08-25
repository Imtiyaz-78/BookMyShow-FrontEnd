import { HttpInterceptorFn } from '@angular/common/http';
import * as CryptoJS from 'crypto-js';
import { AuthService } from '../AuthService/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const encryptedToken = localStorage.getItem('token');
  let token = '';
  if (encryptedToken) {
    try {
      const bytes = CryptoJS.AES.decrypt(
        encryptedToken,
        AuthService.SECRET_KEY
      );
      token = bytes.toString(CryptoJS.enc.Utf8);
      console.log('Decrypted token for header:', token, encryptedToken);
    } catch (e) {
      token = '';
      console.error('Token decryption failed:', e, encryptedToken);
    }
  }

  const authReq = req.clone({
    setHeaders: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  });

  return next(authReq);
};
