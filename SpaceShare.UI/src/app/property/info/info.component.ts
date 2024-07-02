import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { Property } from '../../../model/property.model';
import { InfoService } from './info.service';
import { CookieService } from 'ngx-cookie-service';
import { ReserveService } from '../../reservations/reserve.service';
import { Reservation } from '../../../model/reservation.model';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css'],
})
export class InfoComponent implements OnInit, OnChanges {
  @Input() property!: Property;
  propertyLoaded: boolean = false;
  isWishlisted: boolean = false;
  propertyId!: number;
  ownerId!: number;
  wishlistItem!: { user_id: number; property_id: number };
  userId = this.cookie.get('id');
  isLoggedIn = false;
  hasApplication = false;

  constructor(
    private infoService: InfoService,
    private cookie: CookieService,
    private applicationService: ReserveService
  ) {}

  ngOnInit(): void {
    if (this.property) {
      this.propertyLoaded = true;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['property'] && !changes['property'].firstChange) {
      this.property = { ...changes['property'].currentValue };
      this.ownerId = this.property.owner_id;
      this.propertyId = this.property.id;
      this.wishlistItem = {
        user_id: +this.userId,
        property_id: this.propertyId,
      };
      this.infoService.isWishlisted(this.wishlistItem).subscribe((data) => {
        if (data) this.isWishlisted = data;
      });

      if (!this.userId) {
        this.propertyLoaded = true;
        return;
      } else this.isLoggedIn = true;

      this.applicationService
        .getApplications()
        .subscribe((data: Reservation[]) => {
          data.forEach((data) => {
            if (data.property_id === this.propertyId)
              this.hasApplication = true;
          });
        });

      this.propertyLoaded = true;
    }
  }

  toggleWishlist() {
    this.infoService.wishlist(this.wishlistItem).subscribe((data) => {
      if (data.message.includes('Added')) {
        this.isWishlisted = true;
      } else {
        this.isWishlisted = false;
      }
    });
  }
}
