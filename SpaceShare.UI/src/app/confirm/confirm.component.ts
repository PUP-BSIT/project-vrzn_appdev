import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
})
export class ConfirmComponent {
  @Output() confirmDelete = new EventEmitter<void>();

  closeModal() {
    const modal: any = document.getElementById('my_modal_4');
    if (modal) {
      modal.close();
    }
  }

  onConfirm() {
    this.confirmDelete.emit();
    this.closeModal();
  }
}

