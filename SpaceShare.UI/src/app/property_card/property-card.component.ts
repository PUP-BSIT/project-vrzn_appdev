import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Card } from '../../model/card.model';
import { PropertyCardService } from './property-card.service';
import { ConfirmComponent } from '../confirm/confirm.component';

@Component({
  selector: 'app-property-card',
  templateUrl: './property-card.component.html',
  styleUrls: ['./property-card.component.css'],
})
export class PropertyCardComponent {
  @Input() card!: Card;
  @Input() cardId!: number;
  @Input() owned!: boolean; 
  @Output() cardDeleted = new EventEmitter<number>();
  isDeleting: boolean = false; 
  isDeleted: boolean = false;

  @ViewChild(ConfirmComponent) confirmModal!: ConfirmComponent;

  constructor(private cardService: PropertyCardService) {}

  deleteCard(id: number) {
    this.isDeleting = true;
    this.cardService.deleteProperty(+id).subscribe((data) => {
      if (data.success) {
        setTimeout(() => {
          this.isDeleted = true;
          this.openDeletedModal();
          setTimeout(() => {
            this.isDeleting = false;
            this.isDeleted = false;
            this.cardDeleted.emit(id);
          }, 800);
        }, 2000);
      } else {
        this.isDeleting = false;
      }
    });
  }

  onDeleteConfirmed() {
    this.deleteCard(this.cardId);
    this.closeModal();
  }

  openModal() {
    const modal: any = document.querySelector('#my_modal_4');
    if (modal) {
      modal.showModal();
    }
  }

  closeModal() {
    const modal: any = document.querySelector('#my_modal_4');
    if (modal) {
      modal.close();
    }
  }

  openDeletedModal() {
    const modal: any = document.querySelector('#deleted_modal');
    if (modal) {
      modal.showModal();
    }
  }

  closeDeletedModal() {
    const modal: any = document.querySelector('#deleted_modal');
    if (modal) {
      modal.close();
    }
    this.isDeleted = false;
  }
}
