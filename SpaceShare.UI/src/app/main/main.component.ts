import { Component, OnInit } from '@angular/core';
import { Card } from '../../model/card.model';
import { MainService } from './main.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent implements OnInit {
  cards: Card[] = [];
  filteredCards: Card[] = [];
  paginatedCards: Card[] = [];
  spaceShareSubscription!: Subscription;
  loaded = false;

  currentPage = 1;
  itemsPerPage = 9;
  totalPages = 1;
  uniqueCities: string[] = [];
  filter = false;

  constructor(
    private mainService: MainService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const currentUserId = this.authService.getLoggedUserId();
    this.mainService.getProperties().subscribe(
      (data: Card[]) => {
        if (currentUserId) {
          this.cards = data
            .filter((data) => data.owner_id !== +currentUserId)
            .sort((a, b) => b.rating! - a.rating!);
        } else {
          this.cards = data.sort((a, b) => b.rating! - a.rating!);
        }
        this.uniqueCities = [...new Set(this.cards.map((card) => card.city))];
        this.filterCards();
        this.updatePagination();
        setTimeout(() => {
          this.loaded = true;
        }, 1000);
      },
      () => {
        this.router.navigate(['/went-wrong']);
      }
    );

    this.spaceShareSubscription = this.mainService.spaceShareClicked$.subscribe(
      () => {
        this.spaceShareClick();
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

  toggleFilter() {
    this.filter = !this.filter;
  }

  filterCards(filters?: any): void {
    if (filters) {
      this.filteredCards = this.cards.filter((card) => {
        return (
          (!filters.selectedCity || card.city === filters.selectedCity) &&
          (!filters.selectedBedrooms ||
            card.bedroom === +filters.selectedBedrooms) &&
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

  spaceShareClick(): void {
    this.filteredCards = this.cards;
    this.updatePagination();
  }
}
