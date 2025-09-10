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
  searchVal = new FormControl();

  constructor(
    private adminService: AdminService,
    private modalService: BsModalService,
    private fb: FormBuilder,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.checkState = history.state.data;
    if (this.checkState) {
      this.ongetAllUsers();
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

  ongetAllUsers() {
    this.adminService.getUsers().subscribe({
      next: (res: any) => {
        if (res.success) {
          console.log(res.data.users);
          this.userData = res.data.users.sort(
            (a: any, b: any) => a.userId - b.userId
          );
        }
      },
      error: (err) => {
        console.log(err);
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
        console.error('Error fetching user:', err.message);
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
      .updateUserRole(this.userForm.value.userId, this.userForm.value.roleName)
      .subscribe({
        next: (res) => {
          if (res.success) {
            this.toastService.startToast(res.message);
            this.userForm.reset();
            this.onCancel();
            this.ongetAllUsers();
          }
        },
        error: (err) => {
          this.toastService.startToast(err.message);
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
      this.ongetAllUsers();
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

  onDeleteUser(userId: number): void {
    this.adminService.deleteUserById(userId).subscribe({
      next: (res) => {
        if (res.success) {
          debugger;
        }
        this.toastService.startToast(res.message);
        this.ongetAllUsers();
      },
    });
  }

  openedDropdownId: number | null = null;

  toggleDropdown(userId: number) {
    if (this.openedDropdownId === userId) {
      this.openedDropdownId = null;
    } else {
      this.openedDropdownId = userId;
    }
  }
}
