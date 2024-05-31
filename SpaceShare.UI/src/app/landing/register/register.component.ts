import { Component, ViewChild } from '@angular/core';
import { AgreementComponent } from '../agreement/agreement.component';
import { VerificationComponent } from '../verification/verification.component';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  @ViewChild(VerificationComponent) VerificationComponent!: AgreementComponent;
  showLink = false;

  toggleLinkVisibility() {
    this.showLink = !this.showLink;
  }
}