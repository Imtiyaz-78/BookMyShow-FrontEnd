import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  OnInit,
  TemplateRef,
  ViewChild,
  Input,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FeatherModule } from 'angular-feather';
import { AuthService } from '../AuthService/auth.service';
import { jwtDecode } from 'jwt-decode';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ToastService } from '../../shared/components/toast/toast.service';

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
  @Input() modalRef!: BsModalRef;
  @ViewChild('model') model!: TemplateRef<any>;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private modalService: BsModalService,
    private toastService: ToastService
  ) {}
  openModal() {
    this.modalRef = this.modalService.show(this.model);
  }

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
      roleName: ['', [Validators.required]],
    });
  }

  // This is Login Methods
  onLogin() {
    if (this.userLogin.valid) {
      const data = this.userLogin.value;
      this.authService.login(data).subscribe({
        next: (res) => {
          const token = res?.data?.token;
          if (token) {
            this.authService.decodeToken(token);
            this.authService.loginSuccess(token);
            this.toastService.startToast(res?.message || 'Login successful');
            this.userLogin.reset();
            if (this.modalRef) {
              this.modalRef.hide();
            }
          } else {
            console.error('No token received from API', res);
            this.toastService.startToast(
              'No token received from API',
              'error',
              'Login'
            );
          }
        },
        error: (err) => {
          console.error('Login failed:', err);
          this.toastService.startToast('Login failed', 'error', 'Login');
        },
      });
    }
  }

  // This Method is used for Create New User
  onSignupSubmit(): void {
    if (this.userSignUp.invalid) {
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

  // decodeToken(token: string): void {
  //   const decoded: any = jwtDecode(token);
  //   console.log('Decoded Token:', decoded);
  //   return decoded;
  // }
}
