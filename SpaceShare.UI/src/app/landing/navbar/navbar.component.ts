import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { NavbarService } from './navbar.service';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit{
  
  loggedIn: boolean;

  constructor(private cookieService: CookieService, private navService: NavbarService) {
    this.loggedIn = false
  }

  ngOnInit(): void {
      if(this.cookieService.get('token')) {
        this.loggedIn = true;
      } else {
        this.loggedIn = false;
      }
  }
  
  signout() {
    this.navService.signout().subscribe(data => {
      if(data.success) {
        this.cookieService.deleteAll();
        location.reload();
      }
    })
  }
}
