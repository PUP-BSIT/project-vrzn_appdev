import { Component, OnInit } from '@angular/core';
import { Card } from '../../model/card.model';
import { MainService } from './main.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent implements OnInit {
  cards: Card[] = [];
  filteredCards: Card[] = [];
  paginatedCards: Card[] = [];
  subscription!: Subscription;
  loaded = false;

  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;

  uniqueCities: string[] = [];
  bedroomOptions: number[] = [1, 2, 3, 4, 5];

  selectedCity: string = '';
  minPrice: number = 0;
  maxPrice: number = 10000000;
  selectedBedrooms: number | null = null;

  isPriceDropdownOpen: boolean = false;
  priceRangeLabel: string = 'Select Price Range';

  constructor(private mainService: MainService) {}

  ngOnInit(): void {
    this.mainService.getProperties().subscribe(
      (data: Card[]) => {
        this.cards = data;
        this.filteredCards = this.cards;
        this.uniqueCities = [...new Set(this.cards.map((card) => card.city))];
        this.totalPages = Math.ceil(
          this.filteredCards.length / this.itemsPerPage
        );
        this.updatePaginatedCards();
      },
      (error) => {
        console.error('Error fetching properties:', error);
      }
    );

    setTimeout(() => {
      this.loaded = true;
    }, 1000);
  }

  applyFilters(): void {
    this.filteredCards = this.cards.filter((card) => {
      return (
        (!this.selectedCity || card.city === this.selectedCity) &&
        (!this.selectedBedrooms || card.bedroom === this.selectedBedrooms) &&
        card.price >= this.minPrice &&
        card.price <= this.maxPrice
      );
    });
    this.totalPages = Math.ceil(this.filteredCards.length / this.itemsPerPage);
    this.currentPage = 1;
    this.updatePaginatedCards();
    this.isPriceDropdownOpen = false;
    this.updatePriceRangeLabel();
  }

  clearPriceFilters(): void {
    this.minPrice = 0;
    this.maxPrice = 10000000;
    this.applyFilters();
  }

  updatePaginatedCards(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedCards = this.filteredCards.slice(startIndex, endIndex);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedCards();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedCards();
    }
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
      this.priceRangeLabel = `PHP ${this.minPrice.toLocaleString()} 
        - PHP ${this.maxPrice.toLocaleString()}`;
    }
  }
}
