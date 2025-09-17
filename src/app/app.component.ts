import { Component } from '@angular/core';
import { AuthService } from './auth/AuthService/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'bookMyShow';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = this.authService.decodeToken(token);
      if (decoded && decoded.exp) {
        const expDate = new Date(decoded.exp * 1000);
        console.log('Token expires at:', expDate.toLocaleString());
      }
    }
  }
}
