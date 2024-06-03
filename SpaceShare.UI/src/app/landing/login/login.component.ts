// login.component.ts
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, Validators, FormBuilder, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
 @ViewChild('modalToggle') modalToggle!: ElementRef<HTMLInputElement>;
  @ViewChild('resetPasswordComponent') resetPasswordComponent!: LoginComponent;
  showLink = false;
  loginForm!: FormGroup;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  onSubmit() {
    if (!this.loginForm.valid) {
      return;
    }
    console.log(this.loginForm.value);

    // const credentials = this.loginForm.value;

    this.closeModal();
  }

  get emailControl(): AbstractControl {
    return this.loginForm.get('email')!;
  }

  get passwordControl(): AbstractControl {
    return this.loginForm.get('password')!;
  }

  clearError(controlName: string) {
    this.loginForm.get(controlName)?.markAsUntouched();
  }

  toggleLinkVisibility() {
    this.showLink = !this.showLink;
  }

  closeModal() {
    if (this.modalToggle) {
      this.modalToggle.nativeElement.checked = false;
    }
  }
}
