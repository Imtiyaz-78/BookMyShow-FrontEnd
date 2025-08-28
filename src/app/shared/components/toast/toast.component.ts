import { Component } from '@angular/core';
import { ToastService } from './toast.service';

@Component({
  selector: 'app-toast',
  standalone: false,
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss',
})
export class ToastComponent {
  constructor(public toastService: ToastService) {}

  get toastsArray() {
    return this.toastService.toastSignal();
  }

  remove(toast: any) {
    this.toastService.remove(toast);
  }
}
