import { Component, OnInit } from '@angular/core';
import { Reservation } from '../../model/reservation.model';
import { ApplicationsService } from './applications.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-applications',
  templateUrl: './applications.component.html',
  styleUrl: './applications.component.css'
})
export class ApplicationsComponent implements OnInit {
  reservations: Reservation[] = []; 
  loaded = false;

  constructor(private application: ApplicationsService, private router: Router){}

  ngOnInit(): void {
    this.application.getApplications().subscribe(
      (data: Reservation[]) => {
        this.reservations = data;
        this.loaded = true;
      },
      () => {
        this.router.navigate(['/went-wrong']);
      }
    )
  }


}
