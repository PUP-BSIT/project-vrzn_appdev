import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { NavbarService } from './navbar.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  
  loggedIn: boolean;

  constructor(
    private router: Router,
    private cookieService: CookieService,
    private navService: NavbarService
  ) {
    this.loggedIn = false;
  }

  ngOnInit(): void {
    this.checkLoginStatus();
  }

  checkLoginStatus(): void {
    if (this.cookieService.get('token')) {
      this.loggedIn = true;
    } else {
      this.loggedIn = false;
    }
  }

  isOnWishlistPage(): boolean {
    return this.router.url === '/wishlist';
  }

  signout() {
    this.navService.signout().subscribe(data => {
      if (data.success) {
        this.cookieService.deleteAll();
        location.reload();
      }
    });
  }

  isOnAddProperty(): boolean {
    return this.router.url === '/listing/add';
  }

}

