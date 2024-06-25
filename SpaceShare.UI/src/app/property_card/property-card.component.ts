import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Card } from '../../model/card.model';
import { PropertyCardService } from './property-card.service';

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

  constructor(private cardService: PropertyCardService) {}

  deleteCard(id: number) {
    this.closeModal(id);
    
    this.isDeleting = true;

    this.cardService.deleteProperty(+this.cardId).subscribe((data) => {
      if (data.success) {
        setTimeout(() => {
          this.isDeleted = true;
          setTimeout(() => {
            this.isDeleting = false;
            this.isDeleted = false;
            this.cardDeleted.emit(this.cardId);
          }, 800);
        }, 2000);
      } else {
        this.isDeleting = false;
      }
    });

  }

  closeModal(id: number) {
    const modal = document.getElementById(`my_modal_${id}`) as HTMLDialogElement;
    if (modal) {
      modal.close();
    }
  }

  openConfirmationModal(id: number) {
    const modal = document.querySelector(`#my_modal_${id}`) as HTMLDialogElement;
    if (modal) {
      modal.showModal();
    }
  }
}
