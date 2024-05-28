import { Component } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  // Temporary Just for Display
  firstName: string = 'John';
  lastName: string = 'Doe';
  phone: string = '09123456789';
  birthday: string = '01-01-2024';
  email: string = 'johndoe@example.com';
  password: string = '****************************';

  isEditMode: boolean = false;
  isDeleteVisible: boolean = true;

  toggleEditMode() {
    this.isEditMode = !this.isEditMode;
    this.isDeleteVisible = !this.isEditMode;
  }

  onSaveChanges() {
    this.isEditMode = false;
    this.isDeleteVisible = true;
  }

  onCancel() {
    this.isEditMode = false;
    this.isDeleteVisible = true;
  }

  onPhoneInput(event: Event) {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/\D/g, '');
  }
}
