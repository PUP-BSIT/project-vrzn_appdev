import { CookieService } from 'ngx-cookie-service';

export class AuthService {
  isLoggedIn: boolean;

  constructor(private cookieService: CookieService) {
    this.isLoggedIn = this.cookieService.check('token') 
      && this.cookieService.check('id');
  }

  isAuthenticated() {
    return this.isLoggedIn;
  }

  getLoggedUserId(){
    return this.cookieService.get('id');
  }
}