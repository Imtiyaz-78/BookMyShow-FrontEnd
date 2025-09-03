import { Component, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-list-your-show',
  standalone: false,
  templateUrl: './list-your-show.component.html',
  styleUrl: './list-your-show.component.scss',
})
export class ListYourShowComponent {
  modalRef?: BsModalRef;
  constructor(private modalService: BsModalService) {}

  /**
   * @description Opens the service modal with the given template reference.
   * @author Imtiyaz
   * @param {TemplateRef<any>} openServiceModal - The modal template to be displayed.
   * @returns {void}
   */
  onOpenServiceModal(openServiceModal: TemplateRef<any>) {
    this.modalRef = this.modalService.show(openServiceModal, {
      class: 'modal-dialog-centered',
      ignoreBackdropClick: true,
      keyboard: false,
    });
  }

  /**
   * @description Closes the currently opened modal if it exists.
   * @author Imtiyaz
   * @returns {void}
   */
  onCloseModal() {
    if (this.modalRef) {
      this.modalRef.hide();
    }
  }
}
