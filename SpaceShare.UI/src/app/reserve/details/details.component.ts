import { Component } from '@angular/core';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrl: './details.component.css'
})
export class DetailsComponent {
  dates: string = 'Choose date for reservation';
  guests = {
    adults: 1,
    children: 0,
    infants: 0
  };
  modalType: string = '';

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

  increment(type: 'adults' | 'children' | 'infants' ) {
    this.guests[type]++;
  }

  decrement(type: 'adults' | 'children' | 'infants' ) {
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
      guests: this.guests
    });
    this.closeModal();
  }
}
