import { HttpContextToken } from '@angular/common/http';
import { computed, Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoaderService {
  private activeRequests = signal(0);
  NO_LOADER = new HttpContextToken<boolean>(() => false);
  // computed signal (true if requests > 0)
  readonly loading = computed(() => this.activeRequests() > 0);

  startLoader() {
    this.activeRequests.update((c) => c + 1);
  }

  stopLoader() {
    this.activeRequests.update((c) => Math.max(c - 1, 0));
  }
}
