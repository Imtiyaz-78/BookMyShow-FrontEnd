import { HttpClient } from '@angular/common/http';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AdminService } from '../service/admin.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-users',
  standalone: false,
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent implements OnInit {
  userData: any[] = [];
  modalRef?: BsModalRef;

  constructor(
    private http: HttpClient,
    private admin: AdminService,
    private modalService: BsModalService
  ) {}

  ngOnInit(): void {
    this.ongetAllUsers();
  }

  ongetAllUsers() {
    this.admin.getUsers().subscribe({
      next: (res: any) => {
        if (res.success) {
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

  onEditUser(template: TemplateRef<void>, user: any) {
    this.modalRef = this.modalService.show(template, {
      class: 'largeModel',
      keyboard: false,
      ignoreBackdropClick: true,
    });
  }
}
