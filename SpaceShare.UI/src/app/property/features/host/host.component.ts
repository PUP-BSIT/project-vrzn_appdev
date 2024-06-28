import { Component, Input, OnInit } from '@angular/core';
import { User } from '../../../../model/user.model';
import { HostService } from './host.service';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-host',
  templateUrl: './host.component.html',
  styleUrl: './host.component.css'
})
export class HostComponent implements OnInit {
  @Input() ownerId!: number;
  phoneNumber!: string;
  firstName!: string;
  surname!: string;
  email!: string;
  isLoggedIn!: boolean;

  constructor(private hostService: HostService, 
    private authService: AuthService) {}

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isAuthenticated();

    this.hostService.getUser(this.ownerId).subscribe(data => {
      if (this.isLoggedIn) {
        this.firstName = data.first_name;
        this.surname = data.surname;
        this.phoneNumber = data.phone_number?.[0].number;
        this.email = data.email;
      } else {
        this.firstName = this.maskFirstName(data.first_name);
        this.surname = this.maskSurname(data.surname);
        this.phoneNumber = 
            this.maskPhoneNumber(data.phone_number?.[0].number);
        this.email = this.maskEmail(data.email);
      }
    });
  }

  maskEmail(email: string): string {
    const [name, domain] = email.split('@');
    const maskedName = name[3] + '*'.repeat(name.length - 2) +
         name[name.length - 1];
    const maskedDomain = domain[2] + '*'.repeat(domain.length - 5) +
         domain[domain.length - 1];
    return `${maskedName}@${maskedDomain}`;
  }

  maskPhoneNumber(phone: string): string {
    return phone.slice(0, 4) + '*'.repeat(phone.length - 5) + phone.slice(-1);
  }

  maskFirstName(name: string): string {
    return name[0] + '*'.repeat(name.length - 1);
  }

  maskSurname(surname: string): string {
    return surname[0] + '*'.repeat(surname.length - 2) + 
        surname[surname.length - 1];
  }
}