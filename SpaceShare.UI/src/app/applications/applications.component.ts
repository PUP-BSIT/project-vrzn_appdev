import { Component } from '@angular/core';
import { Reservation } from '../../model/reservation.model';

@Component({
  selector: 'app-applications',
  templateUrl: './applications.component.html',
  styleUrl: './applications.component.css'
})
export class ApplicationsComponent {
  reservations: Reservation[] = []; 
  loaded = false;


}
