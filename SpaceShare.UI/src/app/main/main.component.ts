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
  itemsPerPage: number = 9;
  totalPages: number = 1;
  uniqueCities: string[] = [];

  constructor(private mainService: MainService) {}

  ngOnInit(): void {
    this.mainService.getProperties().subscribe(
      (data: Card[]) => {
        this.cards = data;
        this.uniqueCities = [...new Set(this.cards.map((card) => card.city))];
        this.filterCards();
        this.updatePagination();
        setTimeout(() => {
          this.loaded = true;
        }, 1000)
      },
      () => {
        location.href = '/went-wrong'
      }
    );
  }

  onFiltersChanged(filters: any): void {
    this.filterCards(filters);
    this.updatePagination();
  }

  onPageChanged(page: number): void {
    this.currentPage = page;
    this.updatePaginatedCards();
  }

  filterCards(filters?: any): void {
    if (filters) {
      this.filteredCards = this.cards.filter((card) => {
        return (
          (!filters.selectedCity || card.city === filters.selectedCity) &&
          (!filters.selectedBedrooms || card.bedroom === +filters.selectedBedrooms) &&
          card.price >= filters.minPrice &&
          card.price <= filters.maxPrice
        );
      });
    } else {
      this.filteredCards = this.cards;
    }
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredCards.length / this.itemsPerPage);
    this.currentPage = 1;
    this.updatePaginatedCards();
  }

  updatePaginatedCards(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedCards = this.filteredCards.slice(startIndex, endIndex);
  }
  
}
