import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Property } from '../../../model/property.model';

@Component({
  selector: 'app-total',
  templateUrl: './total.component.html',
  styleUrl: './total.component.css'
})
export class TotalComponent implements OnChanges{
  @Input() property!: Property;
  propertyLoaded = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['property'] && !changes['property'].firstChange) {
      this.propertyLoaded = true;
    }
  }
}
