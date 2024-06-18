import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css'], // Corrected property name
})
export class CarouselComponent implements OnInit{
  @ViewChild('item1', { static: true }) item1!: ElementRef<HTMLDivElement>;
  @ViewChild('item2', { static: true }) item2!: ElementRef<HTMLDivElement>;
  @ViewChild('item3', { static: true }) item3!: ElementRef<HTMLDivElement>;
  @ViewChild('item4', { static: true }) item4!: ElementRef<HTMLDivElement>;

  ngOnInit(): void {
      this.showItem(this.item1.nativeElement);
  }

  showItem(item: HTMLDivElement) {
    const items = [
      this.item1.nativeElement,
      this.item2.nativeElement,
      this.item3.nativeElement,
      this.item4.nativeElement,
    ];

    items.forEach((i) => i.classList.remove('active'));
    item.classList.add('active');
  }
}
