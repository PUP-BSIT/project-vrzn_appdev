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

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css'],
})
export class InfoComponent implements OnInit, OnChanges {
  @Input() property!: Property;
  propertyLoaded: boolean = false;
  isWishlisted: boolean = false;
  property_id!: number;
  wishlistItem!: { user_id: number, property_id: number };
  user_id = this.cookie.get('id');
  isLoggedIn = false;

  constructor(private infoService: InfoService, private cookie: CookieService){}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['property'] && !changes['property'].firstChange) {
      this.property = { ...changes['property'].currentValue };
      this.property_id = this.property.id;
      this.wishlistItem = {
            user_id: +this.user_id,
            property_id: this.property_id,
          };
      this.infoService.isWishlisted(this.wishlistItem).subscribe(
        data => {
          if(data) this.isWishlisted = data;
        }
      )

      if(this.user_id) this.isLoggedIn = true;
      
      this.propertyLoaded = true;
    }
  }

  ngOnInit(): void {
    if (this.property) {
      this.propertyLoaded = true;
    }
  }

  toggleWishlist() {

    this.infoService.wishlist(this.wishlistItem).subscribe(data => {
      if(data.message.includes("Added")){
        this.isWishlisted = true;
      } else {
        this.isWishlisted = false;
      }
    })
  }
}
