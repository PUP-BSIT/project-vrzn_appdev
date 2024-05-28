import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  // Initially set to false to hide the modal
  isModalOpen: boolean = false;

  // Method to close the modal
  closeModal(): void {
    this.isModalOpen = false;
  }
}
