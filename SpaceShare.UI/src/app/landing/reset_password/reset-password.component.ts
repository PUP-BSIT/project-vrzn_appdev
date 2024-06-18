import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  resetForm!: FormGroup;
  alertMessage: string = '';
  alertClass: string = '';

  validEmails: string[] = ['adrian@gmail.com', 'galope@gmail.com'];

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.resetForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
    });
  }

  get emailControl(): AbstractControl {
    return this.resetForm.get('email')!;
  }

  clearError(controlName: string) {
    this.resetForm.get(controlName)?.markAsUntouched();
  }

  onSubmit() {
    if (!this.resetForm.valid) {
      return;
    }

    const email = this.resetForm.value.email;

    if (this.validEmails.includes(email)) {
      this.alertMessage = 'Successfully sent the email reset form.';
      this.alertClass = 'alert-success';
    } else {
      this.alertMessage = 'User does not exist.';
      this.alertClass = 'alert-error';
    }

    this.resetForm.reset();
    this.closeModal();
  }

  closeModal() {
    const modal = document.getElementById('my_modal_3') as HTMLDialogElement;
    if (modal) {
      modal.close();
    }
  }
}
