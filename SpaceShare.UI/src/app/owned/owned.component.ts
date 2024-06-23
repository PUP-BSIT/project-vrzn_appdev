import { Component } from '@angular/core';
import { OwnedService } from './owned.service';
import { CookieService } from 'ngx-cookie-service';
import { Card } from '../../model/card.model';

@Component({
  selector: 'app-owned',
  templateUrl: './owned.component.html',
  styleUrl: './owned.component.css'
})
export class OwnedComponent {
  ownedItems!: Card[];
  user_id!: number;
  loaded:boolean = false;

  constructor(private ownedService: OwnedService, private cookie: CookieService) {}

  ngOnInit(): void {
      this.user_id = +this.cookie.get("id");
      this.ownedService.getOwnProperties(this.user_id).subscribe((data: Card[]) => {
        this.ownedItems = data;
      })

      setTimeout(() => {
        this.loaded = true;
      }, 800);
  }

  onCardDeleted(cardId: number) {
    this.ownedItems = this.ownedItems.filter(card => cardId !== card.id);
  }
}
