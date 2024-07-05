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
  hasReservationNotif!: boolean;
  hasApplicationNotif!: boolean;
  currentUserId!: number;

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

    if (!this.loggedIn) return;

    this.currentUserId = +this.authService.getLoggedUserId();

    this.sseService.initializeEventSource();
    this.notificationSubscription = this.sseService
      .getNotificationObservable()
      .subscribe((notification: NotificationEvent) => {
        this.handleNotification(notification);
      });

    this.navService.getApplicationNotification(this.currentUserId).subscribe({
      next: (data: Notification[]) => {
        if (data.length <= 0) return;
        this.hasApplicationNotif = true;
      }
    })

    this.navService.getReservationNotification(this.currentUserId).subscribe({
      next: (data: Notification[]) => {
        if(data.length <= 0) return;
        this.hasReservationNotif = true;
      }
    })
  }

  toggleApplication() {
    if (this.hasApplicationNotif) {
      this.navService
        .setApplicationNotificationAsRead(this.currentUserId)
        .subscribe()
      this.hasApplicationNotif = false;
    }
  }

  toggleReservation() {
    if (this.hasReservationNotif) {
      this.navService
        .setReservationNotificationAsRead(this.currentUserId)
        .subscribe();
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

