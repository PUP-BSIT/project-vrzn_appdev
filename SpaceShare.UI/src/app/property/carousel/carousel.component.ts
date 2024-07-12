import { Component, ElementRef, Input, OnChanges, OnInit, QueryList, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
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
  @ViewChild('imageModal') imageModal!: ElementRef<HTMLDialogElement>;
  @ViewChild('modalCarousel') modalCarousel!: ElementRef<HTMLDivElement>;
  propertyLoaded: boolean = false;
  images!: { image_url: string }[];
  currentIndex = 0;
  autoSlideInterval!: number;

  ngOnInit(): void {
    if (this.property) {
      this.propertyLoaded = true;
      this.images = this.property.images;
      this.showItem(0);
      this.startAutoSlide();
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
        this.startAutoSlide();
      }, 0);
    }
  }

  showItem(index: number) {
    if (!this.carouselItems) return;

    const items = this.carouselItems.toArray();
    items.forEach((i) => { i.nativeElement.classList.remove('active'); });
    items[index].nativeElement.classList.add('active');
  }

  startAutoSlide() {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
    }
    this.autoSlideInterval = setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.images.length;
      this.showItem(this.currentIndex);
    }, 5000) as unknown as number;
  }

  openModal() {
    this.imageModal.nativeElement.showModal();
    setTimeout(() => {
      this.showItemInModal(0);
    }, 0);
  }

  showItemInModal(index: number) {
    const modalItems = this.modalCarousel.nativeElement.querySelectorAll('.carousel-item');
    modalItems.forEach((item: any) => {
      item.classList.remove('active');
    });
    modalItems[index].classList.add('active');
    this.currentIndex = index;
  }

  previousSlide(index: number) {
    const prevIndex = index === 0 ? this.images.length - 1 : index - 1;
    this.showItemInModal(prevIndex);
    document.getElementById('slide' + (prevIndex + 1))!.scrollIntoView({ behavior: 'smooth' });
  }

  nextSlide(index: number) {
    const nextIndex = index === this.images.length - 1 ? 0 : index + 1;
    this.showItemInModal(nextIndex);
    document.getElementById('slide' + (nextIndex + 1))!.scrollIntoView({ behavior: 'smooth' });
  }
}
