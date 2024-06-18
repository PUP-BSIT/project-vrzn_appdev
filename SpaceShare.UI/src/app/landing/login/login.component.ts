import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {
  FormGroup,
  Validators,
  FormBuilder,
  AbstractControl,
} from '@angular/forms';

import { LoginService } from './login.service';
import { CookieService } from 'ngx-cookie-service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})

export class LoginComponent implements OnInit {
  @ViewChild('modalToggle') modalToggle!: ElementRef<HTMLInputElement>;
  @ViewChild('resetPasswordComponent') resetPasswordComponent!: LoginComponent;
  showLink = false;
  loginForm!: FormGroup;
  errorMessage: string = '';
  constructor(
    private formBuilder: FormBuilder,
    private loginService: LoginService,
    private cookieService: CookieService
  ) { }

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

    try {
      this.loginService.login(this.loginForm.value).subscribe(
        (data) => {
          if (data.success) {
            this.cookieService.set('token', data.token);
            this.cookieService.set('id', data.id);
            this.closeModal();
            location.reload();
          }
        },
        (error: HttpErrorResponse) => {
          if (error.status === 400) {
            this.errorMessage = 'Invalid email or password';
          } else {
            this.errorMessage =
              'An unexpected error occurred. Please try again later.';
          }
        }
      );
    } catch (error) {
      this.errorMessage =
        'An unexpected error occurred. Please try again later.';
    }
  }

  get emailControl(): AbstractControl {
    return this.loginForm.get('email')!;
  }

  get passwordControl(): AbstractControl {
    return this.loginForm.get('password')!;
  }

  clearError(controlName: string) {
    this.loginForm.get(controlName)?.markAsUntouched();
    this.errorMessage = '';
  }

  toggleLinkVisibility() {
    this.showLink = !this.showLink;
  }

  closeModal() {
    if (this.modalToggle) {
      console.log(this.modalToggle.nativeElement.value);
      this.modalToggle.nativeElement.checked = false;
    }
  }
}
