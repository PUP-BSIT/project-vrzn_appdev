import { AbstractControl, ValidationErrors, ValidatorFn,FormControl } from '@angular/forms';

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
export interface ValidationResult {
  [key: string]: boolean;
}

export class PasswordValidator {
  public static strong(control: FormControl): ValidationResult | null {
    const hasNumber = /\d/.test(control.value);
    const hasUpper = /[A-Z]/.test(control.value);
    const hasLower = /[a-z]/.test(control.value);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(control.value);
    const valid = hasNumber && hasUpper && hasLower && hasSpecial;

    if (!valid) {
      // return what's not valid
      return { strong: true };
    }
    return null;
  }
}


