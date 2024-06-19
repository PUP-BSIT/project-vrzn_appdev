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
  owner!: User

  constructor(private hostService: HostService){}

  ngOnInit(): void {
      this.hostService.getUser(this.ownerId).subscribe(data => {
        this.owner = data;
      })
  }

}
