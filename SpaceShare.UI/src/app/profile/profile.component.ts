import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User, UserToUpdate } from '../../model/user.model';
import { CustomValidators } from './custom-validators';
import { CookieService } from 'ngx-cookie-service';
import { ProfileService } from './profile.service';
import { PasswordValidator } from '../profile/custom-validators';
import { PasswordMatchValidator } from './custom-validators';
import { catchError, finalize, tap, Observable, Subject, takeUntil } from 'rxjs';
import { of } from 'rxjs';
import { AlertService } from '../alert/alert.service';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  editForm!: FormGroup;
  isEditMode = false;
  isForgot = false;
  currentUser!: User;
  user_id = this.cookie.get('id');
  passForm!: FormGroup;
  updated = false;
  updatedSuccess = false;
  oldPasswordFieldType: string = 'password';
  passwordFieldType: string = 'password';
  confirmPasswordFieldType: string = 'password';
  isUpdateInvalid!: boolean;


  private unsubscribe$ = new Subject<void>();
  
  constructor(
    private formBuilder: FormBuilder,
    private cookie: CookieService,
    private profileService: ProfileService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.profileService.getUserProfile(+this.user_id).subscribe((user) => {
      this.currentUser = user;
      this.initializeForm(user);
    });

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

    this.alertService.updateInvalid$
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((value) => {
      this.isUpdateInvalid = value;
    });

    this.editForm = this.formBuilder.group({
      firstName: [
        '',
        [
          Validators.required,
          Validators.maxLength(60),
          Validators.pattern('^[a-zA-ZñÑ \\-]*$'),
        ],
      ],
      lastName: [
        '',
        [
          Validators.required,
          Validators.pattern('^[a-zA-ZñÑ \\-]*$'),
          Validators.maxLength(60),
        ],
      ],
      phoneNumber: [
        '',
        [Validators.required, Validators.pattern(/^[0-9]{11}$/)],
      ],
      birthdate: [
        '',
        [Validators.required, CustomValidators.adultAgeValidator('birthdate')],
      ],
    });
  }

  toggleOldPasswordVisibility(): void {
    this.oldPasswordFieldType = this.oldPasswordFieldType === 'password' ? 'text' : 'password';
  }

  togglePasswordVisibility(): void {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  toggleConfirmPasswordVisibility(): void {
    this.confirmPasswordFieldType = this.confirmPasswordFieldType === 'password' ? 'text' : 'password';
  }

  editMode() {
    this.isEditMode = true;
    this.isForgot = false;
  }

  Forgot() {
    this.isForgot = true;
    this.isEditMode = false;
  }

  initializeForm(user: User): void {
    this.editForm.patchValue({
      firstName: user.first_name,
      lastName: user.surname,
      phoneNumber: user.phone_number[0].number,
      birthdate: this.formatDate(user.birthdate.toString()),
    });
  }

  get oldPasswordControl(): AbstractControl {
    return this.passForm.get('old_password')!;
  }

  get passwordControl(): AbstractControl {
    return this.passForm.get('password')!;
  }

  get confirmPasswordControl(): AbstractControl {
    return this.passForm.get('confirmPassword')!;
  }

  get firstNameControl(): AbstractControl {
    return this.editForm.get('firstName')!;
  }

  get lastNameControl(): AbstractControl {
    return this.editForm.get('lastName')!;
  }

  get phoneNumberControl() {
    return this.editForm.get('phoneNumber')!;
  }

  get birthdateControl(): AbstractControl {
    return this.editForm.get('birthdate')!;
  }

  clearError(controlName: string) {
    this.passForm.get(controlName)?.markAsUntouched();
  }

  onReset(): void {
    this.passForm.reset();
  }

  onSubmit(): void {
    this.isEditMode = false;
    if (!this.editForm.dirty && this.editForm.touched) return;

    const { firstName, lastName, phoneNumber, birthdate } = this.editForm.value;

    if (
      this.currentUser.first_name === firstName &&
      this.currentUser.surname === lastName &&
      this.currentUser.phone_number[0].number === phoneNumber &&
      this.formatDate(this.currentUser.birthdate.toString()) === birthdate
    ) {
      return;
    }

    const user: UserToUpdate = {
      id: +this.user_id,
      first_name: firstName,
      surname: lastName,
      birthdate: birthdate,
    };

    const dataToUpdate = {
      user: user,
      oldPhoneNumber: this.currentUser.phone_number[0].number,
      newPhoneNumber: phoneNumber,
    };

    this.profileService.updateUserProfile(dataToUpdate).subscribe((data) => {
      location.reload();
    });

    this.editForm.reset();
  }

  cancelChanges(): void {
    this.isEditMode = false;
    this.isForgot = false;
    this.passForm.reset();
  }

  onChangePassword(): void {
    if (this.passForm.invalid) {
      return;
    }
  
    const { old_password, password } = this.passForm.value;
  
    const passwordChangeRequest = {
      userId: +this.user_id,
      currentPassword: old_password,
      newPassword: password,
    };
  
    console.log('Password Change Request:', passwordChangeRequest);
  
    this.profileService
      .changePassword(passwordChangeRequest)
      .pipe(
        tap((response) => {
          this.updatedSuccess = true;
          this.passForm.reset();
        }),
        catchError((error) => {
          alert('Failed to change password');
          return of(error);
        }),
        finalize(() => {
          console.log('Password change operation finalized');
        })
      )
      .subscribe();
  }
  
  

  formatDate(dateString: string, use?: string): string {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    if (use === 'display') {
      return `${day}-${month}-${year}`;
    }
    return `${year}-${month}-${day}`;
  }
}
