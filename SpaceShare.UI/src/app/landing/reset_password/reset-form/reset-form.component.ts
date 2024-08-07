import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  Validators,
  FormBuilder,
  AbstractControl,
} from '@angular/forms';
import { PasswordValidator, PasswordMatchValidator } from './custom-validator';
import { ActivatedRoute } from '@angular/router';
import { ResetPasswordService } from '../reset-password.service';

@Component({
  selector: 'app-reset-form',
  templateUrl: './reset-form.component.html',
  styleUrls: ['./reset-form.component.css'],
})
export class ResetFormComponent implements OnInit {
  passForm!: FormGroup;
  token!: string;
  message!: string;
  submitted = false;
  success = false;
  error = false;
  showPassword = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private resetService: ResetPasswordService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.token = params['token'];
      if (!this.token) {
      }
    });

    this.passForm = this.formBuilder.group(
      {
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

    this.submitted = true;

    const newPassword = this.passwordControl.value;

    this.resetService.resetPassword(this.token, newPassword).subscribe({
      next: (data) => {
        if (data.success) {
          this.message = data.message;
          this.submitted = false;
          this.success = true;
        }
      },
      error: () => {
        this.submitted = false;
        this.error = true;
      },
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
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
    if (
      this.passForm.hasError('passwordsMismatch') &&
      control.touched &&
      control === this.passForm.get('confirmPassword')
    ) {
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
