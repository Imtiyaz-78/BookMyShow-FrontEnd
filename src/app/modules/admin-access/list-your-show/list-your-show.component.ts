import { Component, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-list-your-show',
  standalone: false,
  templateUrl: './list-your-show.component.html',
  styleUrl: './list-your-show.component.scss',
})
export class ListYourShowComponent {
  constructor(private modalService: BsModalService) {}

  onOpenServiceModal(openServiceModal: TemplateRef<any>) {
    this.modalService.show(openServiceModal, {
      class: 'modal-dialog-centered',
    });
  }
}
