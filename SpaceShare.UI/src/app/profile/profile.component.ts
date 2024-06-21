import {
  Component, Input, OnChanges,
  OnInit, SimpleChanges } from '@angular/core';
import {
  AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../../model/user.model';
import { CustomValidators } from './custom-validators';
import { CookieService } from 'ngx-cookie-service';
import { ProfileService } from './profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  editForm!: FormGroup;
  isEditMode: boolean = false;
  
  currentUser!: User;


  constructor(private formBuilder: FormBuilder, 
    private cookie: CookieService, 
    private profileService: ProfileService) {}

  ngOnInit(): void {

    const user_id = this.cookie.get('id');
    this.profileService.isProfile(+user_id).subscribe(user => {
      this.currentUser = user;
    })

    this.editForm = this.formBuilder.group({
      firstName: ['', [
        Validators.required,  
        Validators.minLength(2),
        Validators.maxLength(60),
        Validators.pattern(/^[a-zA-Z]*$/)
      ]], 

      lastName: ['', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z]*$/)
      ]],

      phoneNumber: ['',[
        Validators.required, 
        Validators.pattern(/^[0-9]{11}$/)
      ]],  

      birthdate: ['', [
        Validators.required, 
        CustomValidators.adultAgeValidator('birthdate')
      ]],
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

    location.reload();
  }

  cancelChanges(): void {
    this.isEditMode = false;
    location.reload();
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
}
