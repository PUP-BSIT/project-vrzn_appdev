import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-verification',
  templateUrl: './verification.component.html',
  styleUrls: ['./verification.component.css']
})
export class VerificationComponent implements OnInit {
  otpForm!: FormGroup;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.otpForm = this.formBuilder.group({
      otp: [null, [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
    });
  }

  get otpControl(): AbstractControl {
    return this.otpForm.get('otp')!;
  }

  clearError(controlName: string) {
    this.otpForm.get(controlName)?.markAsUntouched();
  }

  onSubmit() {
    if (!this.otpForm.valid) {
      return;
    }
    console.log(this.otpForm.value);
    this.closeModal();
  }

  openModal() {
    const modal = document.getElementById('my_modal_3') as HTMLDialogElement;
    if (modal) {
      modal.showModal();
    }
  }

  closeModal() {
    const modal = document.getElementById('my_modal_3') as HTMLDialogElement;
    if (modal) {
      modal.close();
    }
  }
}
