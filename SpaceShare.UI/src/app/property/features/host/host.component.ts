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
        this.firstName = data.first_name;
        this.surname = data.surname;
        this.phoneNumber = data.phone_number?.[0].number;
        this.email = data.email;
      })
  }

}
