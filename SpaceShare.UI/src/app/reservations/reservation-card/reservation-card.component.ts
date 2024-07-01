import { Component, Input, OnInit } from '@angular/core';
import { Reservation } from '../../../model/reservation.model';
import { PropertyService } from '../../property/property.service';
import { Property } from '../../../model/property.model';

@Component({
  selector: 'app-reservation-card',
  templateUrl: './reservation-card.component.html',
  styleUrl: './reservation-card.component.css'
})
export class ReservationCardComponent implements OnInit {
  @Input() reservation!: Reservation;
  property!: Property;

  constructor(private propertyService: PropertyService){}

  ngOnInit(): void {
    this.propertyService.getProperty(this.reservation.property_id).subscribe({
      next: (data: Property) => {
        this.property = data;
      },
    });
  }

}
