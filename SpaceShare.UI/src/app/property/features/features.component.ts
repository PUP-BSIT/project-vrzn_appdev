import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Property } from '../../../model/property.model';

@Component({
  selector: 'app-features',
  templateUrl: './features.component.html',
  styleUrl: './features.component.css',
})
export class FeaturesComponent implements OnInit, OnChanges {
  @Input() property!: Property;
  propertyLoaded: boolean = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['property'] && !changes['property'].firstChange) {
      this.property = { ...changes['property'].currentValue };
      this.propertyLoaded = true;
    }
  }

  ngOnInit(): void {
    if (this.property) {
      this.propertyLoaded = true;
    }
  }
}
