import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent {
  resetForm!: FormGroup;

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
    console.log(this.resetForm.value);
    this.closeModal();
  }

  closeModal() {
    const modal = document.getElementById('my_modal_3') as HTMLDialogElement;
    if (modal) {
      modal.close();
    }
  }
}
