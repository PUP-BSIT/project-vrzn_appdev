import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AgreementComponent } from '../agreement/agreement.component';
import { VerificationComponent } from '../verification/verification.component';
import { LocationService } from './location.service';
import { Region, Province, City } from '../../../model/location.model';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { User } from '../../../model/user.model';
import { RegisterService } from './register.service';
import { CustomValidators, PasswordValidator, MatchPasswordValidator } from '../register/custom-validators';
import { FormData } from '../../../model/formdata.model';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  @ViewChild('modalToggle') modalToggle!: ElementRef<HTMLInputElement>;
  firstPage = true;
  secondPage = false;
  thirdPage = false;
  fourthPage = false;
  verificationMode = false;
  registerForm!: FormGroup;

  regions: Region[] = [];
  provinces: Province[] = [];
  cities: City[] = [];

  selectedRegion: string = '';
  selectedProvince: string = '';
  selectedCity: string = '';
  selectedRegionName: string = '';
  selectedProvinceName: string = '';
  selectedCityName: string = '';

  @ViewChild(VerificationComponent) verificationComponent!: AgreementComponent;
  showLink = false;
  randomNumber!: number;
  bodyToPass!: User;

  toggleLinkVisibility() {
    this.showLink = !this.showLink;
  }
  showPasswordRequirements: boolean = false;
  constructor(
    private locationService: LocationService,
    private formBuilder: FormBuilder,
    private registerService: RegisterService
  ) {}

  getFormValues(): FormData {
    return {
      firstName: this.firstNameControl.value,
      lastName: this.lastNameControl.value,
      email: this.emailControl.value,
      phoneNumber: this.phoneNumberControl.value,
      birthdate: this.birthdateControl.value,
      region: this.selectedRegionName,
      province: this.selectedProvinceName,
      city: this.selectedCityName,
      postalCode: this.postalCodeControl.value,
    };
  }
  
  ngOnInit(): void {
    this.loadRegions();

    this.registerForm = this.formBuilder.group({
      firstName: [
        '',
        [
          Validators.required,
          Validators.maxLength(60),
          Validators.pattern('^[a-zA-ZñÑ \\-]*$'),
        ],
      ],

      lastName: ['', [Validators.required,  Validators.pattern('^[a-zA-ZñÑ \\-]*$'),Validators.maxLength(60)]],

      middleName: ['',   [Validators.pattern('^[a-zA-ZñÑ \\-]*$'), Validators.maxLength(60)]],

      phoneNumber: [
        '',
        [Validators.required, Validators.pattern(/^[0-9]{11}$/)],
      ],

      email: ['', [Validators.required, Validators.email]],

      birthdate: [
        '',
        [Validators.required, CustomValidators.adultAgeValidator('birthdate')],
      ],
      region: ['', [Validators.required]],
      province: [{ value: '', disabled: true }, [Validators.required]],
      city: [{ value: '', disabled: true }, [Validators.required]],

      postalCode: ['', [Validators.required, Validators.pattern(/^\d{4}$/)]],

      password: ['', [Validators.required, PasswordValidator.strong]],
      confirmPassword: ['', [Validators.required, MatchPasswordValidator]],
    });
  }

  //#region getter functions
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
  //#endregion

  getValidationClass(control: AbstractControl): string {
    if (control.valid && control.touched) {
      return 'bg-green-50 border border-green-500 text-green-900 placeholder-green-700';
    } else if (control.invalid && control.touched) {
      return 'border-red-500';
    } else if (control.value) {
      return 'bg-green-50 border border-green-500 text-green-900 placeholder-green-700';
    } else {
      return '';
    }
  }

  areRequiredFieldsValid(page: number): boolean {
    switch (page) {
      case 1:
        return this.firstNameControl.valid &&
               this.lastNameControl.valid &&
               this.phoneNumberControl.valid &&
               this.emailControl.valid &&
               this.birthdateControl.valid;
      case 2:
        return this.regionControl.valid &&
               this.provinceControl.valid &&
               this.cityControl.valid &&
               this.postalCodeControl.valid;
      case 3:
        return this.passwordControl.valid &&  
                this.confirmPasswordControl.valid;
      default:
        return false;
    }
  }

  nextPage() {
    if (this.firstPage && this.areRequiredFieldsValid(1)) {
      this.firstPage = false;
      this.secondPage = true;
    } else if (this.secondPage && this.areRequiredFieldsValid(2)) {
      this.secondPage = false;
      this.thirdPage = true;
    } else if (this.thirdPage && this.areRequiredFieldsValid(3)) {
      this.thirdPage = false;
      this.fourthPage = true;
    }
  }

  prevPage() {
    if (this.verificationMode) {
      this.verificationMode = false;
      this.firstPage = false;
      this.secondPage = false;
      this.thirdPage = false;
      this.fourthPage = true;
    } else if (this.fourthPage) {
      this.fourthPage = false;
      this.thirdPage = true;
    } else if (this.thirdPage) {
      this.thirdPage = false;
      this.secondPage = true;
    } else if (this.secondPage) {
      this.secondPage = false;
      this.firstPage = true;
    }
  }

  handleSubmit(): void {
    this.toggleLinkVisibility();
    this.verificationMode = true;

    const data = this.registerForm.value;

    const body: User = {
      first_name: data.firstName,
      middle_name: data.middleName,
      surname: data.lastName,
      birthdate: new Date(data.birthdate),
      email: data.email,
      password: data.password,
      region: this.selectedRegionName,
      province: this.selectedProvinceName,
      city: this.selectedCityName,
      postal_code: data.postalCode,
      phone_number: [
        {
          number: data.phoneNumber,
          number_type: 'mobile',
        },
      ],
    };

    this.bodyToPass = body;

    this.randomNumber = this.generateRandomSixDigitNumber();

    const verify = { code: +this.randomNumber, mailTo: data.email };

    this.registerService
      .sendMail(verify)
      .subscribe((data) => console.log(data));
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
    const selectedRegion = this.regions.find(region => region.region_code === this.regionControl.value);
    this.selectedRegion = this.regionControl.value;
    this.selectedRegionName = selectedRegion ? selectedRegion.region_name : '';
    this.fillProvinces();
  }

  onProvinceChange(): void {
    const selectedProvince = this.provinces.find(province => province.province_code === this.provinceControl.value);
    this.selectedProvince = this.provinceControl.value;
    this.selectedProvinceName = selectedProvince ? selectedProvince.province_name : '';
    this.fillCities();
  }

  onCityChange(): void {
    const selectedCity = this.cities.find(city => city.city_code === this.cityControl.value);
    this.selectedCity = this.cityControl.value;
    this.selectedCityName = selectedCity ? selectedCity.city_name : '';
  }

  generateRandomSixDigitNumber(): number {
    const min = 100000;
    const max = 999999;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  closeModal() {
    if (this.modalToggle) {
      console.log(this.modalToggle.nativeElement.value);
      this.modalToggle.nativeElement.checked = false;
    }
  }
}