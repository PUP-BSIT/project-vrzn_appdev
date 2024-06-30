import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { Property } from '../../../model/property.model';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrl: './details.component.css',
})
export class DetailsComponent implements OnInit {
  @Input() property!: Property;
  dates = 'When are you planning to move?';
  guests = {
    adults: 1,
    children: 0,
    infants: 0,
  };
  message!: string;
  modalType!: string;
  minDate!: string;

  ngOnInit(): void {
    this.minDate = this.formatDate(new Date());
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['property'] && !changes['property'].firstChange) {
      this.property = changes['property'].currentValue;    
    }
  }

  openModal(type: string) {
    this.modalType = type;
  }

  closeModal() {
    this.modalType = '';
  }

  saveDates() {
    this.closeModal();
  }

  saveGuests() {
    this.closeModal();
  }

  increment(type: 'adults' | 'children' | 'infants') {
    this.guests[type]++;
  }

  decrement(type: 'adults' | 'children' | 'infants') {
    if (this.guests[type] > 0) {
      this.guests[type]--;
    }
  }

  totalGuests(): string {
    const totalGuests = this.guests.adults + this.guests.children;
    const totalInfants = this.guests.infants;
    const guestLabel = totalGuests === 1 ? 'guest' : 'guests';
    const infantLabel = totalInfants === 1 ? 'infant' : 'infants';

    let result = `${totalGuests} ${guestLabel}`;
    if (totalInfants > 0) {
      result += `, ${totalInfants} ${infantLabel}`;
    }
    return result;
  }

  confirmReservation() {
    console.log('Reservation confirmed:', {
      dates: this.dates,
      guests: this.guests,
      notes: this.message
    });
    this.closeModal();
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2); // Months are zero-based
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  validateDate(input: string): void {
    if (new Date(input) < new Date(this.minDate)) {
      this.dates = this.minDate;
    }
  }
}
