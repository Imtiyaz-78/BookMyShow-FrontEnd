import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { LoaderService } from '../../core/service/loader.service';
import { finalize, Observable } from 'rxjs';

export function httpInterceptor(
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> {
  const loader = inject(LoaderService);

  loader.startLoader();

  return next(req).pipe(
    finalize(() => {
      loader.stopLoader();
    })
  );
}
