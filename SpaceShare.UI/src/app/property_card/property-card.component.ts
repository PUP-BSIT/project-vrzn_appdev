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
    this.isDeleting = true;
    this.cardService.deleteProperty(+id).subscribe((data) => {
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
}
