import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const encryptedToken = localStorage.getItem('token');
  let token = localStorage.getItem('token');
  let authReq = req;
  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: token ? `Bearer ${encryptedToken}` : '',
      },
    });
  }

  return next(authReq);
};
