import { Component } from '@angular/core';
import { FormGroup, Validators, FormBuilder, AbstractControl } from '@angular/forms';
import { PasswordValidator,PasswordMatchValidator } from './custom-validator';
@Component({
  selector: 'app-reset-form',
  templateUrl: './reset-form.component.html',
  styleUrl: './reset-form.component.css'
})

export class ResetFormComponent {
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

}
