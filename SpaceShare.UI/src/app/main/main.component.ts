import { Component, OnInit } from '@angular/core';
import { Card } from '../../model/card.model';
import { MainService } from './main.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'], // Use styleUrls instead of styleUrl
})
export class MainComponent implements OnInit {
  cards: Card[] = [];
  subscription!: Subscription;
  loaded = false

  constructor(private mainService: MainService) {}

  ngOnInit(): void {
    this.mainService.getProperties().subscribe(
      (data: Card[]) => {
        this.cards = data;
      },
      (error) => {
        console.error('Error fetching properties:', error);
      }
    );

    setTimeout(() => {
      this.loaded = true
    }, 1000)
  }
}
