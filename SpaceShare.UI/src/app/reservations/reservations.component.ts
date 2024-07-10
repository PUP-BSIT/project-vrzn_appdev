import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Reservation } from '../../model/reservation.model';
import { ReserveService } from './reserve.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reservations',
  templateUrl: './reservations.component.html',
  styleUrl: './reservations.component.css',
})
export class ReservationsComponent implements OnInit {
  reservations: Reservation[] = [];
  loaded = false;
  deleted = false;

  constructor(private application: ReserveService, private router: Router) {}

  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.application.getApplications().subscribe(
      (data: Reservation[]) => {
        this.reservations = data;
        this.loaded = true;
      },
      () => {
        this.router.navigate(['/went-wrong']);
      }
    );
  }

  handleChildDelete(id: number): void {
    this.reservations = this.reservations.filter(
      (reservation) => reservation.id !== id
    );
    this.deleted = true;
    setTimeout(() => {
      this.deleted = false;
    }, 1500);
  }
}
