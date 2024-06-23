import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-filtration',
  templateUrl: './filtration.component.html',
  styleUrls: ['./filtration.component.css']
})
export class FiltrationComponent implements OnInit {
  @Input() uniqueCities: string[] = [];
  @Output() filtersChanged = new EventEmitter<any>();

  bedroomOptions: number[] = [1, 2, 3, 4, 5];

  selectedCity: string = '';
  minPrice: number = 0;
  maxPrice: number = 10000000;
  selectedBedrooms: number | null = null;

  isPriceDropdownOpen: boolean = false;
  priceRangeLabel: string = 'Select Price Range';

  constructor() {}

  ngOnInit(): void {}

  applyFilters(): void {
    this.filtersChanged.emit({
      selectedCity: this.selectedCity,
      minPrice: this.minPrice,
      maxPrice: this.maxPrice,
      selectedBedrooms: this.selectedBedrooms
    });
    this.isPriceDropdownOpen = false;
    this.updatePriceRangeLabel();
  }

  clearPriceFilters(): void {
    this.minPrice = 0;
    this.maxPrice = 10000000;
    this.applyFilters();
  }

  togglePriceDropdown(): void {
    this.isPriceDropdownOpen = !this.isPriceDropdownOpen;
  }

  setPriceRange(min: number, max: number): void {
    this.minPrice = min;
    this.maxPrice = max;
    this.applyFilters();
  }

  updatePriceRangeLabel(): void {
    if (this.minPrice === 0 && this.maxPrice === 10000000) {
      this.priceRangeLabel = 'Select Price Range';
    } else if (this.minPrice === 0) {
      this.priceRangeLabel = `Below PHP ${this.maxPrice.toLocaleString()}`;
    } else if (this.maxPrice === 10000000) {
      this.priceRangeLabel = `Above PHP ${this.minPrice.toLocaleString()}`;
    } else {
      this.priceRangeLabel = `PHP ${this.minPrice.toLocaleString()} - PHP ${this.maxPrice.toLocaleString()}`;
    }
  }
}
