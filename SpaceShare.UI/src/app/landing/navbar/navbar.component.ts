import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit{
  
  loggedIn: boolean;

  constructor(private cookieService: CookieService) {
    this.loggedIn = false
  }

  ngOnInit(): void {
      if(this.cookieService.get('token')) {
        this.loggedIn = true;
      } else {
        this.loggedIn = false;
      }
  }
}
