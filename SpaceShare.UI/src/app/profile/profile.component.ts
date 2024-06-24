import {
  Component, Input, OnChanges,
  OnInit, SimpleChanges } from '@angular/core';
import {
  AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User, UserToUpdate } from '../../model/user.model';
import { CustomValidators } from './custom-validators';
import { CookieService } from 'ngx-cookie-service';
import { ProfileService } from './profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  editForm!: FormGroup;
  isEditMode: boolean = false;
  currentUser!: User;
  user_id = this.cookie.get('id');

  constructor(
    private formBuilder: FormBuilder,
    private cookie: CookieService,
    private profileService: ProfileService
  ) {}

  ngOnInit(): void {
    this.profileService.getUserProfile(+this.user_id).subscribe((user) => {
      this.currentUser = user;
      console.log(this.currentUser)
    });

    this.editForm = this.formBuilder.group({
      firstName: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(60),
          Validators.pattern(/^[a-zA-Z]*$/),
        ],
      ],

      lastName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z]*$/)]],

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

  editMode() {
    this.isEditMode = true;
    this.initializeForm(this.currentUser);
  }

  initializeForm(user: User): void {
    this.editForm.patchValue({
      firstName: user.first_name,
      lastName: user.surname,
      phoneNumber: user.phone_number[0].number,
      birthdate: this.formatDate(user.birthdate.toString()),
    });
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

  onSubmit(): void {
    this.isEditMode = false;
    if (!this.editForm.dirty && this.editForm.touched) return;


    const { firstName, lastName, phoneNumber, birthdate } = this.editForm.value;

    if (this.currentUser.first_name === firstName &&
      this.currentUser.surname === lastName &&
      this.currentUser.phone_number[0].number === phoneNumber &&
      this.formatDate(this.currentUser.birthdate.toString()) === birthdate) {
      return;
    }

    const user: UserToUpdate = {
        id: +this.user_id,
        first_name: firstName,
        surname: lastName,
        birthdate: birthdate
    }

    const dataToUpdate = {
      user: user,
      oldPhoneNumber: this.currentUser.phone_number[0].number,
      newPhoneNumber: phoneNumber
    };

    console.log(dataToUpdate)

    this.profileService.updateUserProfile(dataToUpdate).subscribe(data => {
      console.log("updated: ", data);
      location.reload(); //trigger oninit again instead of realoading?
    })

    this.editForm.reset();
  }

  cancelChanges(): void {
    this.isEditMode = false;
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
