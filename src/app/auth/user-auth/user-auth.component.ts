import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FeatherModule } from 'angular-feather';
import { AuthService } from '../AuthService/auth.service';

@Component({
  selector: 'app-user-auth',
  standalone: true,
  templateUrl: './user-auth.component.html',
  styleUrls: ['./user-auth.component.scss'],
  imports: [ReactiveFormsModule, CommonModule, FeatherModule],
})
export class UserAuthComponent implements OnInit {
  openSignuForm = false;
  userLogin!: FormGroup;
  userSignUp!: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService) {}

  ngOnInit(): void {
    this.OnInitLoginForm();
    this.OnInitSignUpForm();
  }

  OnInitLoginForm(): void {
    this.userLogin = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  OnInitSignUpForm(): void {
    this.userSignUp = this.fb.group({
      name: ['', [Validators.required]],
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required]],
      roleName: ['USER'],
    });
  }

  // This is Login Methods
  onLogin() {
    if (this.userLogin.invalid) {
      return;
    }
    this.authService.login(this.userLogin.value).subscribe({
      next: (decoded) => {
        if (decoded) {
          console.log('Login Success:', decoded['sub']);
          alert('Login Successful!');
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  // This Method is used for Create New User
  onSignupSubmit(): void {
    if (this.userSignUp.invalid) {
      this.userSignUp.markAllAsTouched();
      return;
    }

    this.authService.createNewUser(this.userSignUp.value).subscribe({
      next: (res: any) => {
        console.log(res);
        alert('Account created successfully!');
        this.userSignUp.reset();
      },
      error: (err) => {
        console.error(' Signup Failed:', err);
      },
    });
  }

  onToggleForm() {
    this.openSignuForm = !this.openSignuForm;
  }
}
