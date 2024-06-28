import { Component, Input, OnInit } from '@angular/core';
import { User } from '../../../../model/user.model';
import { HostService } from './host.service';

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

  constructor(private hostService: HostService){}

  ngOnInit(): void {
    this.hostService.getUser(this.ownerId).subscribe(data => {
      this.firstName = this.maskFirstName(data.first_name);
      this.surname = this.maskSurname(data.surname);
      this.phoneNumber = this.maskPhoneNumber(data.phone_number?.[0].number);
      this.email = this.maskEmail(data.email);
    });
  }

  maskEmail(email: string): string {
    const [name, domain] = email.split('@');
    const maskedName = name[0] + '*'.repeat(name.length - 2) + name[name.length - 1];
    return `${maskedName}@${domain}`;
  }

  maskPhoneNumber(phone: string): string {
    return phone.slice(0, 4) + '*'.repeat(phone.length - 5) + phone.slice(-1);
  }

  maskFirstName(name: string): string {
    return name[0] + '*'.repeat(name.length - 1);
  }

  maskSurname(surname: string): string {
    return surname[0] + '*'.repeat(surname.length - 2) + surname[surname.length - 1];
  }
}
