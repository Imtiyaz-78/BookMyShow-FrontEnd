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
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private modalService: BsModalService,
    private toastService: ToastService
  ) {}

  /**
   * @description Opens the signup/login modal.
   * @author Md Imtiyaz
   * @returns void
   */
  openModal() {
    this.modalRef = this.modalService.show(this.model);
  }

  /**
   * @description Angular lifecycle hook - initializes login and signup forms.
   * @author Md Imtiyaz
   * @returns void
   */
  ngOnInit(): void {
    this.OnInitLoginForm();
    this.OnInitSignUpForm();
  }

  /**
   * @description Initializes the login form with validation rules.
   * @author Md Imtiyaz
   * @returns void
   */
  OnInitLoginForm(): void {
    this.userLogin = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  /**
   * @description Initializes the signup form with validation rules.
   * @author Md Imtiyaz
   * @returns void
   */
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

  /**
   * @description Handles user login by validating form, calling API, decoding token, and showing toasts.
   * @author Md Imtiyaz
   * @returns void
   */
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
            this.toastService.startToast('No token received from API');
          }
        },
        error: (err) => {
          this.toastService.startToast(err?.message || 'Login failed');
        },
      });
    }
  }

  /**
   * @description Handles user signup by validating form, sending API request, and showing success/error messages.
   * @author Md Imtiyaz
   * @returns void
   */
  onSignupSubmit(): void {
    if (this.userSignUp.invalid) {
      return;
    }

    this.authService.createNewUser(this.userSignUp.value).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.toastService.startToast(
            res?.message || 'Account created successfully!'
          );
          this.userSignUp.reset();
          if (this.modalRef) {
            this.modalRef.hide();
          }
        }
      },
      error: (err) => {
        this.toastService.startToast(err?.message);
      },
    });
  }

  /**
   * @description Toggles between login and signup forms inside modal.
   * @author Md Imtiyaz
   * @returns void
   */
  onToggleForm() {
    this.openSignuForm = !this.openSignuForm;
  }

  // decodeToken(token: string): void {
  //   const decoded: any = jwtDecode(token);
  //   console.log('Decoded Token:', decoded);
  //   return decoded;
  // }

  /**
   * @description Toggles password visibility between plain text and hidden input type.
   * @author Md Imtiyaz
   * @returns void
   */
  togglePassword() {
    this.showPassword = !this.showPassword;
  }
}
