import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder, AbstractControl } from '@angular/forms';
import { PasswordValidator, PasswordMatchValidator } from './custom-validator';

@Component({
  selector: 'app-reset-form',
  templateUrl: './reset-form.component.html',
  styleUrls: ['./reset-form.component.css']
})
export class ResetFormComponent implements OnInit {
  constructor(private formBuilder: FormBuilder) {}
  passForm!: FormGroup;

  ngOnInit() {
    this.passForm = this.formBuilder.group(
      {
        old_password: ['', [Validators.required, Validators.minLength(8)]],
        password: ['', [PasswordValidator.strong, Validators.maxLength(40)]],
        confirmPassword: ['', Validators.required],
      },
      {
        validators: PasswordMatchValidator.passwordsMatch(),
      }
    );
  }

  onSubmit() {
    if (!this.passForm.valid) return;
    // Handle form submission logic
  }

  get passwordControl(): AbstractControl {
    return this.passForm.get('password')!;
  }

  get confirmPasswordControl(): AbstractControl {
    return this.passForm.get('confirmPassword')!;
  }

  clearError(controlName: string) {
    this.passForm.get(controlName)?.markAsUntouched();
  }

  getValidationClass(control: AbstractControl): string {
    if (this.passForm.hasError('passwordsMismatch') && control.touched) {
      return 'border-red-500';
    } else if (control.valid && control.touched) {
      return 'bg-green-50 border border-green-500 text-green-900 placeholder-green-700';
    } else if (control.invalid && control.touched) {
      return 'border-red-500';
    } else if (control.value) {
      return 'bg-green-50 border border-green-500 text-green-900 placeholder-green-700';
    } else {
      return '';
    }
  }
}
