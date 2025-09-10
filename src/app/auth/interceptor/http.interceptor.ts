import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { LoaderService } from '../../core/service/loader.service';
import { finalize, Observable } from 'rxjs';

export const httpInterceptor = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const loader = inject(LoaderService);

  // Optionally skip loader for certain requests
  // if (req.headers.has('skip-loader')) return next(req);

  loader.show();
  return next(req).pipe(finalize(() => loader.hide()));
};
