import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { NavbarService } from './navbar.service';
import { Subscription, timeout } from 'rxjs';
import { NotificationEvent, SseService } from './sse.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  loggedIn: boolean;
  hasReservationNotif = false;
  hasApplicationNotif = false;

  private notificationSubscription!: Subscription;

  constructor(
    private router: Router,
    private cookieService: CookieService,
    private navService: NavbarService,
    private sseService: SseService,
    private authService: AuthService
  ) {
    this.loggedIn = false;
  }

  ngOnInit(): void {
    this.checkLoginStatus();
    console.log(this.loggedIn);
    if (!this.loggedIn) return;
    this.sseService.initializeEventSource();
    this.notificationSubscription = this.sseService
      .getNotificationObservable()
      .subscribe((notification: NotificationEvent) => {
        this.handleNotification(notification);
      });
  }

  toggleApplication() {
    if (this.hasApplicationNotif) {
      this.hasApplicationNotif = false;
    }
  }

  toggleReservation() {
    if (this.hasReservationNotif) {
      this.hasReservationNotif = false;
    }
  }

  ngOnDestroy(): void {
    if (this.notificationSubscription) {
      this.notificationSubscription.unsubscribe();
    }
  }

  checkLoginStatus(): void {
    if (this.cookieService.get('token')) {
      this.loggedIn = true;
    } else {
      this.loggedIn = false;
    }
  }

  handleNotification(notification: NotificationEvent): void {
    const { userToUpdate, isApplication, isReservation } = notification;
    const currentUserId = this.authService.getLoggedUserId();

    if (!currentUserId) return;

    if (isApplication && userToUpdate === +currentUserId) {
      this.hasApplicationNotif = true;
    }

    if (isReservation && userToUpdate === +currentUserId) {
      this.hasReservationNotif = true;
    }
  }

  isOnWishlistPage(): boolean {
    return this.router.url === '/wishlist';
  }

  signout() {
    this.navService.signout().subscribe((data) => {
      if (data.success) {
        this.cookieService.delete('token', '/');
        this.cookieService.delete('id', '/');
        if (this.cookieService.get('token')) return;
        this.sseService.closeConnection();
        location.href = '/home';
      }
    });
  }

  isOnAddProperty(): boolean {
    return this.router.url === '/listing/add';
  }
}

