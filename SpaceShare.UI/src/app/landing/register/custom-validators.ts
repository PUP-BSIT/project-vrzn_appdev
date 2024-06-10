import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {
  static adultAgeValidator(fieldName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const birthdate = control.value;

      if (!birthdate) {
        return null; 
      }

      // Calculate age based on the birthdate
      const today = new Date();
      const birthDate = new Date(birthdate);
      const age = today.getFullYear() - birthDate.getFullYear();

      // Check if age is less than 18
      if (age < 18) {
        return { 'adultAge': { fieldName } }; 
      }

      return null; 
    };
  }

}

