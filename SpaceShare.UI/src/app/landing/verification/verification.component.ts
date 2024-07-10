import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder, AbstractControl } from '@angular/forms';
import { User } from '../../../model/user.model';
import { RegisterService } from '../register/register.service';

@Component({
  selector: 'app-verification',
  templateUrl: './verification.component.html',
  styleUrls: ['./verification.component.css'],
})
export class VerificationComponent implements OnInit {
  otpForm!: FormGroup;
  @Input() email!: string;
  @Input() code!: number;
  @Input() userToCreate!: User;
  @Input() close!: () => void;
  verified = false;
  message!: string;
  errorMessage = '';
  showlink = true;
  disableButton = false;
  triggerToast = false;
  submitted = false;
  success = false;

  constructor(
    private formBuilder: FormBuilder,
    private readonly registerService: RegisterService
  ) {}

  ngOnInit() {
    this.otpForm = this.formBuilder.group({
      otp: [
        null,
        [Validators.required, Validators.minLength(6), Validators.maxLength(6)],
      ],
    });

    this.otpControl.valueChanges.subscribe(() => {
      this.errorMessage = '';
    });
  }

  sendAgain() {
    const verify = { code: this.code, mailTo: this.email };
    this.registerService.sendMail(verify).subscribe(data => {
      if(data.hasOwnProperty('messageId')){
        this.disableButton = true;
        this.triggerToast = true;
        setTimeout(() => {
          this.triggerToast = false;
        }, 2000);
        setTimeout(() => {
          this.disableButton = false;
        }, 15000);
      }
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

    this.submitted = true;

    try {
      if (+this.otpForm.value.otp === +this.code) {
        this.registerService.registerUser(this.userToCreate).subscribe(
          (data) => {
            if (data.success) {
              this.verified = true;
              this.message = data.message;
              this.closeModal();
              this.close();
              this.submitted = false;
              this.success = true;
            } else {
              this.errorMessage = 'Verification failed. Please try again.';
            }
          },
          () => {
            this.errorMessage =
              'An unexpected error occurred. Please try again later.';
          }
        );
      } else {
        this.errorMessage = 'Incorrect Code';
      }
    } catch {
      this.errorMessage =
        'An unexpected error occurred. Please try again later.';
    }
  }

  goBack() {
    this.showlink = false;
  }

  closeModal() {
    const modal = document.getElementById('my_modal_3') as HTMLDialogElement;
    if (modal) {
      modal.close();
    }
  }
}
