// toast.service.ts
import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ToastService {
  toastSignal = signal<ToastMessage[]>([]);

  // startToast(
  //   message: string,
  //   type: ToastMessage['type'] = 'success',
  //   title: string = '',
  //   description: string = ''
  // ) {
  //   const toast: ToastMessage = {
  //     message,
  //     type,
  //     title,
  //     description,
  //     timestamp: Date.now(),
  //   };
  //   this.toastSignal.update((list) => [...list, toast]);
  //   setTimeout(() => this.remove(toast.timestamp!), 8000);
  // }
  startToast(toast: Partial<ToastMessage>) {
    const finalToast: ToastMessage = {
      message: toast.message ?? '',
      type: toast.type ?? 'success',
      title: toast.title ?? '',
      description: toast.description ?? '',
      timestamp: Date.now(),
    };

    this.toastSignal.update((list) => [...list, finalToast]);

    setTimeout(() => this.remove(finalToast.timestamp!), 8000);
  }

  // removeByTimestamp(timestamp: number) {
  //   this.toastSignal.update((list) =>
  //     list.filter((t) => t.timestamp !== timestamp)
  //   );
  // }

  // remove(toast: ToastMessage) {
  //   if (toast && toast.timestamp) {
  //     this.removeByTimestamp(toast.timestamp);
  //   }
  // }

  remove(toast: ToastMessage | number) {
    const timestamp = typeof toast === 'number' ? toast : toast?.timestamp;

    if (!timestamp) return;

    this.toastSignal.update((list) =>
      list.filter((t) => t.timestamp !== timestamp)
    );
  }
}

export interface ToastMessage {
  type:
    | 'success'
    | 'error'
    | 'info'
    | 'warning'
    | 'delete'
    | 'save'
    | 'notification'
    | 'processing'
    | 'generic';
  title?: string;
  message: string;
  description?: string;
  timestamp?: number;
}
