import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder, AbstractControl } from '@angular/forms';
import { ResetPasswordService } from './reset-password.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  resetForm!: FormGroup;
  alertMessage = '';
  alertClass = '';

  constructor(private formBuilder: FormBuilder, private resetService: ResetPasswordService) {}

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
      this.alertMessage = 'Please enter a valid email address.';
      return;
    }
    this.alertMessage = `You will receive an email with instructions to reset your password 
    if an account exists for this email address.`;
    this.alertClass = 'alert-success';
    
    const email = this.resetForm.value.email;

    this.resetService.forgotPassword(email).subscribe();
    
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
