import { Component, Input, OnInit } from '@angular/core';
import { Card } from '../../model/card.model';
import { WishlistService } from './wishlist.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.css',
})
export class WishlistComponent implements OnInit {
  wishlistedItem!: Card[];
  user_id!: number;
  loaded = false;

  constructor(
    private wishlistService: WishlistService,
    private cookie: CookieService
  ) {}

  ngOnInit(): void {
    this.user_id = +this.cookie.get('id');
    this.wishlistService
      .getProperties(this.user_id)
      .subscribe((data: Card[]) => {
        this.wishlistedItem = data;
      });

    setTimeout(() => {
      this.loaded = true;
    }, 800);
  }
}
