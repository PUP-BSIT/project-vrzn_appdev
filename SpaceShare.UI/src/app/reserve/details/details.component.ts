import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { Property } from '../../../model/property.model';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css'],
})
export class DetailsComponent implements OnInit {
  @Input() property!: Property;
  dates = 'When are you planning to move?';
  guests = {
    adults: 1,
    children: 0,
    infants: 0,
  };
  message: string = '';
  modalType!: string;
  minDate!: string;
  maxDate!: string;
  isDateValid = true;
  showAdultValidationMessage = false;
  showCharacterLimitAlert = false;
  showMessageRequiredAlert = false;
  isMessageTouched = false;

  ngOnInit(): void {
    const currentDate = new Date();
    this.minDate = this.formatDate(currentDate);
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 5);
    this.maxDate = this.formatDate(maxDate);
    this.dates = this.formatDate(currentDate);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['property'] && !changes['property'].firstChange) {
      console.log(this.property);
    }
  }

  openModal(type: string) {
    this.modalType = type;
  }

  closeModal() {
    this.modalType = '';
  }

  saveDates() {
    if (this.isDateValid) {
      this.closeModal();
    }
  }

  saveGuests() {
    this.closeModal();
  }

  increment(type: 'adults' | 'children' | 'infants') {
    this.guests[type]++;
  }

  decrement(type: 'adults' | 'children' | 'infants') {
    if (type === 'adults' && this.guests.adults > 1) {
      this.guests.adults--;
    } else if (type === 'adults' && this.guests.adults === 1) {
      this.showAdultValidationMessage = true;
      setTimeout(() => {
        this.showAdultValidationMessage = false;
      }, 1000);
    } else if (type !== 'adults' && this.guests[type] > 0) {
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
    if (this.message.length === 0) {
      this.showMessageRequiredAlert = true;
      setTimeout(() => {
        this.showMessageRequiredAlert = false;
      }, 3000);
      return;
    }

    console.log('Reservation confirmed:', {
      dates: this.dates,
      guests: this.guests,
      notes: this.message,
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
    const inputDate = new Date(input);
    const minDate = new Date(this.minDate);
    const maxDate = new Date(this.maxDate);
    if (inputDate < minDate || inputDate > maxDate || isNaN(inputDate.getTime())) {
      this.isDateValid = false;
    } else {
      this.isDateValid = true;
      this.dates = this.formatDate(inputDate);
    }
  }

  checkMessageLength(): void {
    if (this.message.length >= 320) {
      this.showCharacterLimitAlert = true;
    } else {
      this.showCharacterLimitAlert = false;
    }
  }

  checkMessageRequired(): void {
    this.isMessageTouched = true;
    if (this.message.length === 0) {
      this.showMessageRequiredAlert = true;
    } else {
      this.showMessageRequiredAlert = false;
    }
  }

  onFocus(): void {
    this.isMessageTouched = true;
  }
}
