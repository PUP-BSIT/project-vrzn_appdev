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
import { SpaceHistory } from '../../../model/history.model';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css'],
})
export class InfoComponent implements OnInit, OnChanges {
  @Input() property!: Property;
  propertyLoaded = false;
  isWishlisted = false;
  propertyId!: number;
  ownerId!: number;
  wishlistItem!: { user_id: number; property_id: number };
  userId = this.cookie.get('id');
  isLoggedIn = false;
  hasApplication = false;
  hasHistory = false;

  constructor(
    private infoService: InfoService,
    private cookie: CookieService,
    private applicationService: ReserveService
  ) {}

  ngOnInit(): void {
    if (this.property) {
      this.initializePropertyData();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['property'] && !changes['property'].firstChange) {
      this.initializePropertyData();
    }
  }

  private initializePropertyData(): void {
    this.property = { ...this.property };
    this.ownerId = this.property.owner_id;
    this.propertyId = this.property.id;
    this.wishlistItem = {
      user_id: +this.userId,
      property_id: +this.propertyId,
    };

    this.infoService.isWishlisted(this.wishlistItem).subscribe((data) => {
      if (data) this.isWishlisted = data;
    });

    if (!this.userId) { this.propertyLoaded = true; return; }
    else { this.isLoggedIn = true; }

    this.fetchApplication();
    this.checkSpaceHistory();

    this.propertyLoaded = true;
  }

  private fetchApplication(): void {
    this.applicationService
      .getApplications()
      .subscribe((data: Reservation[]) => {
        this.hasApplication = data.some(
          (app) => app.property_id === this.propertyId
        );
      });
  }

  private checkSpaceHistory(): void {
    this.infoService.hasSpaceHistory(+this.userId, +this.propertyId).subscribe({
      next: (data: SpaceHistory[]) => {
        if(data.length > 0){
          this.hasHistory = true;
        }
      },
      error: () => {
        location.href = '/went-wrong'
      }
    })
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
