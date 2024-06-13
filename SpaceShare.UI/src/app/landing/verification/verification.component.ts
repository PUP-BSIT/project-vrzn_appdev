import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder, AbstractControl } from '@angular/forms';
import { User } from '../../../model/user.model';
import { RegisterService } from '../register/register.service';

@Component({
  selector: 'app-verification',
  templateUrl: './verification.component.html',
  styleUrls: ['./verification.component.css']
})
export class VerificationComponent implements OnInit {
  otpForm!: FormGroup;
  @Input() code!: number;
  @Input() userToCreate!: User;
  verified: boolean = false;
  message!: string;
  errorMessage: string = '';

  constructor(private formBuilder: FormBuilder, private readonly registerService: RegisterService) {}

  ngOnInit() {
    this.otpForm = this.formBuilder.group({
      otp: [null, [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
    });

    this.otpControl.valueChanges.subscribe(() => {
      this.errorMessage = '';
    });
  }

  get otpControl(): AbstractControl {
    return this.otpForm.get('otp')!;
  }

  clearError(controlName: string) {
    this.otpForm.get(controlName)?.markAsUntouched();
    this.errorMessage = '';
  }

  async onSubmit() {
    if (!this.otpForm.valid) {
      return;
    }
    console.log(this);
  
    try {
      if (+this.otpForm.value.otp === +this.code) {
        this.registerService.registerUser(this.userToCreate).subscribe(
          (data) => {
            if (data.success) {
              this.verified = true;
              this.message = data.message;
            } else {
              this.errorMessage = 'Verification failed. Please try again.';
            }
          },
          () => {
            this.errorMessage = 'An unexpected error occurred. Please try again later.';
          }
        );
      } else {
        this.errorMessage = 'Invalid OTP';
      }
    } catch {
      this.errorMessage = 'An unexpected error occurred. Please try again later.';
    }
  }  

  closeModal() {
    const modal = document.getElementById('my_modal_3') as HTMLDialogElement;
    if (modal) {
      modal.close();
    }
  }
}