import { Injectable, signal, computed } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoaderService {
  loading = signal(false);

  startLoader() {
    this.loading.set(true);
  }

  stopLoader() {
    this.loading.set(false);
  }
}
