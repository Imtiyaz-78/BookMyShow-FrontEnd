import { HttpClient } from '@angular/common/http';
import { Component, HostListener, OnInit, TemplateRef } from '@angular/core';
import { AdminService } from '../service/admin.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ToastService } from '../../../shared/components/toast/toast.service';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  switchMap,
} from 'rxjs';
import { AuthService } from '../../../auth/AuthService/auth.service';

@Component({
  selector: 'app-users',
  standalone: false,
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent implements OnInit {
  userData: any[] = [];
  modalRef?: BsModalRef;
  userForm!: FormGroup;
  checkState: any;
  openedDropdownId: number | null = null;
  searchVal = new FormControl();

  constructor(
    private adminService: AdminService,
    private modalService: BsModalService,
    private fb: FormBuilder,
    private authService: AuthService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    // Checking State Data
    this.checkState = history.state.data;
    console.log(this.checkState);

    if (this.checkState) {
      this.onGetAllUsers();
    }
    this.initilizeUserForm();
    this.onSearchUserByUserName();

    //gettign role
    this.userForm
      .get('roleName')
      ?.valueChanges.pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((role: string) => {
        if (role) {
          this.onFilterUserByRole(role);
        } else {
          this.userData = [];
        }
      });
  }

  initilizeUserForm() {
    this.userForm = this.fb.group({
      userId: [''],
      username: ['', Validators.required],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      roleName: ['', Validators.required],
    });
  }

  // onGetAllUsers() {
  //   this.adminService.getUsers().subscribe({
  //     next: (res: any) => {
  //       if (res.success) {
  //         this.userData = res.data.users.sort(
  //           (a: any, b: any) => a.userId - b.userId
  //         );
  //       }
  //     },
  //     error: (err) => {
  //       this.toastService.startToast({
  //         message: err.message,
  //         type: 'error',
  //       });
  //     },
  //   });
  // }

  page = 0;
  size = 10;
  totalEntries = 0;
  isLoading = false;
  scrollTimeout: any;

  onGetAllUsers() {
    this.isLoading = true;
    this.adminService.getUsers(this.page, this.size).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.userData = [...this.userData, ...res.data.users];
          this.totalEntries = res.data.totalEntries;
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.toastService.startToast({
          message: err.message,
          type: 'error',
        });
      },
    });
  }

  onEditUserByID(updateUser: TemplateRef<void>, user: any): void {
    this.adminService.getUserById(user.userId).subscribe({
      next: (res) => {
        if (res.success) {
          this.userForm.patchValue({
            userId: res.data.user.userId,
            username: res.data.user.username,
            name: res.data.user.name,
            email: res.data.user.email,
            phoneNumber: res.data.user.phoneNumber,
            roleName: res.data.user.roleName,
          });
        }

        this.modalRef = this.modalService.show(updateUser, {
          class: 'modal-dialog-centered ',
          keyboard: false,
          ignoreBackdropClick: true,
        });
      },
      error: (err) => {
        this.toastService.startToast({
          message: err.message,
          type: 'error',
        });
      },
    });
  }

  onCancel(): void {
    if (this.modalRef) {
      this.modalRef?.hide();
    }
  }

  onUpdtateUser(): void {
    this.adminService
      .updateUserRole(this.authService.userDetails().userId)
      .subscribe({
        next: (res) => {
          if (res.success) {
            this.toastService.startToast({
              message: res.message,
              type: 'success',
            });
            this.userForm.reset();
            this.onCancel();
            this.onGetAllUsers();
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

  //  Search User By UserName
  onSearchUserByUserName(): void {
    this.searchVal.valueChanges
      .pipe(
        debounceTime(500),
        map((value) => value.trim()),
        distinctUntilChanged(),
        switchMap((value) => {
          if (!value) {
            return this.adminService.getUsers();
          }
          return this.adminService.searchUserByUserName(value);
        })
      )
      .subscribe({
        next: (res: any) => {
          if (res.success) {
            this.userData = res.data.users;
            return;
          }
        },
        error: () => {
          this.userData = [];
        },
      });
  }

  // Filter Users By UserRole
  onFilterUserByRole(role: string) {
    if (role === 'ALL') {
      this.onGetAllUsers();
      return;
    }

    this.adminService.getUserByUserRole(role).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.userData = res.data.users;
        }
      },
      error: () => {
        this.userData = [];
      },
    });
  }

  toggleDropdown(userId: number) {
    if (this.openedDropdownId === userId) {
      this.openedDropdownId = null;
    } else {
      this.openedDropdownId = userId;
    }
  }

  // This method is for making a user an admin
  onMakeAdmin(userId: number): void {
    this.adminService.makeUserAdmin(userId).subscribe({
      next: (res) => {
        if (res.success) {
          debugger;
          this.toastService.startToast(res.message);
          this.openedDropdownId = null;
          this.onGetAllUsers();
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

  // This method is for deleting a user
  onDeleteUser(userId: number): void {
    this.adminService.deleteUserById(userId).subscribe({
      next: (res) => {
        if (res.success) {
          debugger;
          this.toastService.startToast(res.message);
          this.openedDropdownId = null;
          this.onGetAllUsers();
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

  //

  onScroll(event: any) {
    clearTimeout(this.scrollTimeout);

    this.scrollTimeout = setTimeout(() => {
      const allLoaded = this.userData.length >= this.totalEntries;
      if (allLoaded || this.isLoading) return;

      this.page++;
      this.onGetAllUsers();
    }, 300);
  }
}
