import { Component, ElementRef, Input, OnChanges, OnInit, Query, QueryList, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { Property } from '../../../model/property.model';
import { first } from 'rxjs';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css'], // Corrected property name
})
export class CarouselComponent implements OnInit, OnChanges {
  @Input() property!: Property;
  @ViewChildren('carouselItems') carouselItems!: QueryList<ElementRef<HTMLDivElement>>; 
  propertyLoaded: boolean = false;
  images!: { image_url: string }[];

  ngOnInit(): void {
    if (this.property) {
      this.propertyLoaded = true;
      this.showItem(0);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['property'] && !changes['property'].firstChange) {
      this.property = { ...changes['property'].currentValue };
      this.images = this.property.images;
      this.propertyLoaded = true;

      //why does this work and this.showItem doesnt lol
      setTimeout(() => {
        this.showItem(0);
      }, 0)
    }
  }

  showItem(index: number) {
    if(!this.carouselItems) return;

    const items = this.carouselItems.toArray();
    items.forEach((i) => {i.nativeElement.classList.remove('active')});
    items[index].nativeElement.classList.add('active');
  }
}
