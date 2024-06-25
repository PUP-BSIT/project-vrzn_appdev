import { Component, ElementRef, EventEmitter, Input, Output, ViewChild, viewChild } from '@angular/core';
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

  @ViewChild(`myModal`) modalElement!: ElementRef;

  constructor(private cardService: PropertyCardService) {}

  deleteCard(id: number) {
    this.closeModal();

    this.isDeleting = true;

    this.cardService.deleteProperty(id).subscribe((data) => {
      if (data.success) {
        setTimeout(() => {
          this.isDeleted = true;
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

  closeModal() {
    const modal = this.modalElement.nativeElement as HTMLDialogElement;
    modal.close();
  }

  openConfirmationModal() {
     const modal = this.modalElement.nativeElement as HTMLDialogElement;
     modal.showModal();
  }
}
