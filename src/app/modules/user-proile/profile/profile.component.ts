import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { AuthService } from '../../../auth/AuthService/auth.service';
import { UsersService } from '../services/users.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastService } from '../../../shared/components/toast/toast.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CommonService } from '../../../services/common.service';
import { map, Observable } from 'rxjs';

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
  cityData$!: Observable<any>;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private usersService: UsersService,
    private toastService: ToastService,
    private modalService: BsModalService,
    public commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.usersData = this.authService.userDetails();
    this.onGetUserDetailsById();
    this.initForm();
    this.onGetStatesData();
  }

  //
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
      pincode: [0],
      addressLine1: [null],
      addressLine2: [null],
      city: [null],
      state: [''],
    });
  }

  // This is Helper function for MM/DD/YYYY → YYYY-MM-DD (input[type=date] format)
  convertDateForForm(dateStr: string | null): string | null {
    if (!dateStr) return null;
    const [month, day, year] = dateStr.split('/');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }

  // This Methods is used for Handle File Upload
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1];
      this.userProfileForm.patchValue({ profileImg: base64 });
    };

    reader.readAsDataURL(file);
    console.log(file);
  }

  //
  onGetUserDetailsById() {
    this.usersService.getUserDetailsById(this.usersData.userId).subscribe({
      next: (res: any) => {
        if (res.success) {
          const user = res.data;

          const patchData = {
            ...user,
            dob: this.convertDateForForm(user.dob),
            anniversaryDate: this.convertDateForForm(user.anniversaryDate),
          };

          this.userDetails = patchData;
          this.userProfileForm.patchValue(patchData);
        }
      },
      error: (err) => {
        this.toastService.startToast({
          message: err.message,
          type: 'error',
        });
      },
    });
  }

  // This Method is used for Open Email or Contact Number Update
  onEdit(label: any, editProfileModal: TemplateRef<any>) {
    this.modalRef = this.modalService.show(editProfileModal, {
      class: 'modal-dialog-centered',
      ignoreBackdropClick: true,
      keyboard: false,
    });
    this.editValue = label;
  }

  // This Method is to Update email or Mobile Based Condition
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

    this.usersService
      .updateUserDetails(this.usersData.userId, payload)
      .subscribe({
        next: (res: any) => {
          if (res.success) {
            this.toastService.startToast({
              message: res.message,
              type: 'success',
            });
            this.closeModel();
          }
        },
        error: (err) => {
          this.toastService.startToast({
            message: err.message,
            type: 'error',
          });
        },
      });
  }

  // This Method is used To Update Whole Users
  onSubmit() {
    let payload = {
      ...this.userProfileForm.value,
      dob: this.commonService.formatDateToMMDDYYYY(
        this.userProfileForm.get('dob')?.value
      ),
      anniversaryDate: this.commonService.formatDateToMMDDYYYY(
        this.userProfileForm.get('anniversaryDate')?.value
      ),
    };

    this.usersService
      .updateUserDetails(this.usersData.userId, payload)
      .subscribe({
        next: (res: any) => {
          if (res.success) {
            this.toastService.startToast({
              message: res.message,
              type: 'success',
            });
          }
        },
        error: (err) => {
          this.toastService.startToast({
            message: err.message,
            type: 'error',
          });
        },
      });
  }

  // This Method is used for to Get All States Data
  onGetStatesData() {
    this.cityData$ = this.usersService.getAllStates().pipe(
      map((res: any) => res.data.stateDto) // extract the array
    );
  }

  // This Method is used to Close contact or Email Update
  closeModel() {
    if (this.modalRef) {
      this.modalRef.hide();
    }
  }
}
