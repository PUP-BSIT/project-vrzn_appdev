import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Reservation } from '../../../model/reservation.model';
import { PropertyService } from '../../property/property.service';
import { Property } from '../../../model/property.model';
import { ReservationCardService } from './reservation-card.service';

@Component({
  selector: 'app-reservation-card',
  templateUrl: './reservation-card.component.html',
  styleUrl: './reservation-card.component.css'
})
export class ReservationCardComponent implements OnInit {
  @Input() reservation!: Reservation;
  @Output() delete = new EventEmitter<number>();
  property!: Property;

  constructor(private propertyService: PropertyService, 
    private reservationService: ReservationCardService){}

  ngOnInit(): void {
    this.propertyService.getProperty(this.reservation.property_id).subscribe({
      next: (data: Property) => {
        this.property = data;
      },
    });
  }

  handleDelete(){
    this.reservationService.deleteReservation(+this.reservation.id!).subscribe({
      next: () => {
        this.delete.emit(this.reservation.id);
      },
      error: () => {
        location.href = '/went-wrong';
      }
    })
  }

}
