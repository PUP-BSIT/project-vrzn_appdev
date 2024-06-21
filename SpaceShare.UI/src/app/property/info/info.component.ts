import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { Property } from '../../../model/property.model';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css'],
})
export class InfoComponent implements OnInit, OnChanges {
  @Input() property!: Property;
  propertyLoaded: boolean = false;
  isWishlisted: boolean = false;

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

  toggleWishlist() {
    this.isWishlisted = !this.isWishlisted;
  }
}
