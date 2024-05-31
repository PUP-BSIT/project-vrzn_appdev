import { Component } from '@angular/core';
import { FormGroup, Validators, FormBuilder, AbstractControl } from '@angular/forms';
@Component({
  selector: 'app-reset-form',
  templateUrl: './reset-form.component.html',
  styleUrl: './reset-form.component.css'
})

export class ResetFormComponent {
  constructor(private formBuilder: FormBuilder) {}
  passForm!: FormGroup;

  ngOnInit() {
    this.passForm = this.formBuilder.group({
      password: ['', [Validators.required]],
    });
  }

  onSubmit() {
    if (!this.passForm.valid) {
      return;
    }
    console.log(this.passForm.value);
  }


  get passwordControl(): AbstractControl {
    return this.passForm.get('password')!;
  }

  get confirmPass(): AbstractControl {
    return this.passForm.get('confirm_pass')!;
  }

  clearError(controlName: string) {
    this.passForm.get(controlName)?.markAsUntouched();
  }

}
