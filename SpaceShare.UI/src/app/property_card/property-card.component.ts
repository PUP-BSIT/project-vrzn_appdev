import { Component, Input } from '@angular/core';
import { Card } from '../../model/card.model';

@Component({
  selector: 'app-property-card',
  templateUrl: './property-card.component.html',
  styleUrl: './property-card.component.css'
})
export class PropertyCardComponent {
  @Input() card: Card | undefined;
  @Input() cardId!: number;
}
