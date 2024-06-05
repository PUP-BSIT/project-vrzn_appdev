import { Component } from '@angular/core';
import { Card } from '../../model/card.model';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
})
export class MainComponent {
  cards: Card[] = [
    {
      id: 1,
      title: 'Apartment for rent',
      location: 'South Signal, Taguig',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus libero dolor, bibendum ac venenatis vel, eleifend sed lectus.',
      price: 5000,
    },
    {
      id: 2,
      title: 'Apartment for Rent 2',
      location: 'Alabang, Muntinlupa',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus libero dolor, bibendum ac venenatis vel, eleifend sed lectus.',
      price: 5000,
    },
    {
      id: 3,
      title: 'Villa for Rent 3',
      location: 'San Fernando, La Union',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus libero dolor, bibendum ac venenatis vel, eleifend sed lectus.',
      price: 5000,
    },
  ];
}
