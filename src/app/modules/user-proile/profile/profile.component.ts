import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { AuthService } from '../../../auth/AuthService/auth.service';
import { UsersService } from '../services/users.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastService } from '../../../shared/components/toast/toast.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  usersData: any;
  userDetails: any;
  userProfileForm!: FormGroup;
  modalRef?: BsModalRef;
  editValue: any;
  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private users: UsersService,
    private toastService: ToastService,
    private modalService: BsModalService
  ) {}

  ngOnInit(): void {
    console.log(this.authService.userDetails());
    this.usersData = this.authService.userDetails();
    console.log(this.usersData.userId);
    this.onGetUserDetailsById();
    this.initForm();
  }

  initForm(): void {
    this.userProfileForm = this.fb.group({
      name: [''],
      username: [''],
      email: [''],
      phoneNumber: [''],
      profileImg: [null],
      dob: [null],
      identity: [null],
      married: [null],
      anniversaryDate: [null],
      pincode: [null],
      addressLine1: [null],
      addressLine2: [null],
      city: [null],
      state: [null],
    });
  }

  onGetUserDetailsById() {
    this.users.getUserDetailsById(this.usersData.userId).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.userDetails = res.data;
          this.userProfileForm.patchValue(this.userDetails);
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  onEdit(label: any, editProfileModal: TemplateRef<any>) {
    this.modalRef = this.modalService.show(editProfileModal, {
      class: 'modal-dialog-centered',
      ignoreBackdropClick: true,
      keyboard: false,
    });
    this.editValue = label;
  }

  onUpdateUser() {
    if (!this.usersData?.userId) {
      return;
    }

    let payload: any = {};
    if (this.editValue === 'email') {
      payload = { email: this.userProfileForm.get('email')?.value };
    } else if (this.editValue === 'mobile') {
      payload = { phoneNumber: this.userProfileForm.get('phoneNumber')?.value };
    }

    this.users.updateUserDetails(this.usersData.userId, payload).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.toastService.startToast(res.message);
          this.closeModel();
        }
      },
      error: (err) => {
        this.toastService.startToast(err.message);
      },
    });
  }

  closeModel() {
    if (this.modalRef) {
      this.modalRef.hide();
    }
  }
}
