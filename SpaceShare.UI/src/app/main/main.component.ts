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
  paginatedCards: Card[] = [];
  subscription!: Subscription;
  loaded = false;

  currentPage: number = 1;
  itemsPerPage: number = 1; // Change "itemsPerPage" to desired value
  totalPages: number = 1;

  constructor(private mainService: MainService) {}

  ngOnInit(): void {
    this.mainService.getProperties().subscribe(
      (data: Card[]) => {
        this.cards = data;
        this.totalPages = Math.ceil(this.cards.length / this.itemsPerPage);
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

  updatePaginatedCards(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedCards = this.cards.slice(startIndex, endIndex);
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
}
