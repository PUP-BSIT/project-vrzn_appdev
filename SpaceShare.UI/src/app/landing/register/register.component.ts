import { Component, OnInit, ViewChild } from '@angular/core';
import { AgreementComponent } from '../agreement/agreement.component';
import { VerificationComponent } from '../verification/verification.component';
import { LocationService } from './location.service';
import { Region, Province, City } from '../../../model/location.model';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
  ValidatorFn,ValidationErrors
} from '@angular/forms';
import { User } from '../../../model/user.model';
import { RegisterService } from './register.service';
import { CustomValidators } from '../register/custom-validators'; 
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;

  regions: Region[] = [];
  provinces: Province[] = [];
  cities: City[] = [];

  selectedRegion: string = '';
  selectedProvince: string = '';
  selectedCity: string = '';

  @ViewChild(VerificationComponent) verificationComponent!: AgreementComponent;
  showLink = false;
  randomNumber!: number;
  bodyToPass!: User;

  toggleLinkVisibility() {
    this.showLink = !this.showLink;
  }

  constructor(
    private locationService: LocationService,
    private formBuilder: FormBuilder,
    private registerService: RegisterService
  ) {}

  ngOnInit(): void {
    this.loadRegions();

    this.registerForm = this.formBuilder.group({
      firstName: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(60),
        Validators.pattern(/^(?!.*?[^aeiou]{5})(?!.*?[aeiou]{3})[a-z]*$/)
      ]],
      lastName: ['', [
        Validators.required, Validators.minLength(2),
        Validators.maxLength(60),
        Validators.pattern(/^(?!.*?[^aeiou]{5})(?!.*?[aeiou]{3})[a-z]*$/)
      ]],
      middleName: ['',
        Validators.pattern(/^(?!.*?[^aeiou]{5})(?!.*?[aeiou]{3})[a-z]*$/)],
      phoneNumber: ['',[
        Validators.required, 
        Validators.pattern(/^[0-9]{11}$/)
      ]],
      email: ['', [Validators.required, Validators.email]],

      
      birthdate: ['', [Validators.required, CustomValidators.adultAgeValidator('birthdate')]],
      region: ['', [Validators.required]],
      province: [{ value: '', disabled: true }, [Validators.required]],
      city: [{ value: '', disabled: true }, [Validators.required]],
      postalCode: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    });

  }

  

  get firstNameControl(): AbstractControl {
    return this.registerForm.get('firstName')!;
  }

  get lastNameControl(): AbstractControl {
    return this.registerForm.get('lastName')!;
  }

  get middleNameControl(): AbstractControl {
    return this.registerForm.get('middleName')!;
  }

  get emailControl(): AbstractControl {
    return this.registerForm.get('email')!;
  }

  get phoneNumberControl() {
    return this.registerForm.get('phoneNumber')!;
  }

  get birthdateControl(): AbstractControl {
    return this.registerForm.get('birthdate')!;
  }

  get regionControl(): AbstractControl {
    return this.registerForm.get('region')!;
  }

  get provinceControl(): AbstractControl {
    return this.registerForm.get('province')!;
  }

  get cityControl(): AbstractControl {
    return this.registerForm.get('city')!;
  }

  get postalCodeControl(): AbstractControl {
    return this.registerForm.get('postalCode')!;
  }

  get passwordControl(): AbstractControl {
    return this.registerForm.get('password')!;
  }

  get confirmPasswordControl(): AbstractControl {
    return this.registerForm.get('confirmPassword')!;
  }

  handleSubmit(): void {
    this.toggleLinkVisibility();

    const data = this.registerForm.value;

    const body: User = {
      first_name: data.firstName,
      middle_name: data.middleName,
      surname: data.lastName,
      birthdate: new Date(data.birthdate),
      email: data.email,
      password: data.password,
      region: data.region,
      province: data.province,
      city: data.city,
      postal_code: data.postalCode,
      phone_number: [{
        number: data.phoneNumber,
        number_type: "mobile"
      }]
    }

    this.bodyToPass = body;

    this.randomNumber = this.generateRandomSixDigitNumber();

    const verify = { code: +this.randomNumber, mailTo: data.email };

    this.registerService.sendMail(verify).subscribe(data => console.log(data))
  }

  loadRegions(): void {
    this.locationService.getRegions().subscribe((data: Region[]) => {
      this.regions = data;
    });
  }

  fillProvinces(): void {
    this.locationService.getProvinces().subscribe((data: Province[]) => {
      this.provinces = data.filter(
        (entry: Province) => entry.region_code === this.selectedRegion
      );
      this.provinces.sort((a, b) =>
        a.province_name.localeCompare(b.province_name)
      );
      this.selectedProvince = '';
      this.selectedCity = ''; 
      this.cities = [];
      this.registerForm.controls['province'].enable();
      this.registerForm.controls['city'].disable();
    });
  }

  fillCities(): void {
    this.locationService.getCities().subscribe((data: City[]) => {
      this.cities = data.filter(
        (entry: City) => entry.province_code === this.selectedProvince
      );
      this.cities.sort((a, b) => a.city_name.localeCompare(b.city_name));
      this.selectedCity = '';
      this.registerForm.controls['city'].enable();
    });
  }

  resetSelections(level: string): void {
    if (level === 'province') {
      this.selectedProvince = '';
      this.selectedCity = '';
      this.cities = [];
      this.registerForm.controls['city'].disable();
    } else if (level === 'city') {
      this.selectedCity = '';
    }
  }

  onRegionChange(): void {
    this.selectedRegion = this.regionControl.value;
    this.fillProvinces();
  }

  onProvinceChange(): void {
    this.selectedProvince = this.provinceControl.value;
    this.fillCities();
  }

  generateRandomSixDigitNumber(): number {
    const min = 100000;
    const max = 999999; 
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
}
