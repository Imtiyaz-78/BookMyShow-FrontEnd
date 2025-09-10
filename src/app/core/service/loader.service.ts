import { Injectable, signal, computed } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoaderService {
  private _activeRequests = signal(0);

  readonly isLoading = computed(() => this._activeRequests() > 0);

  show(): void {
    this._activeRequests.update((n) => n + 1);
  }

  hide(): void {
    this._activeRequests.update((n) => Math.max(0, n - 1));
  }

  reset(): void {
    this._activeRequests.set(0);
  }
}
