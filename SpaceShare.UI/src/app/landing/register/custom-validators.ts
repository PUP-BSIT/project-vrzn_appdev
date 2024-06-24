import { AbstractControl, ValidationErrors, ValidatorFn, FormControl, FormGroup } from '@angular/forms';

export class CustomValidators {
  static adultAgeValidator(fieldName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const birthdate = control.value;

      if (!birthdate) {
        return null;  // Return null if no birthdate is provided
      }

      // Calculate age based on the birthdate
      const today = new Date();
      const birthDate = new Date(birthdate);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      // Adjust age if the birthdate hasn't occurred yet this year
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      // Check if age is less than 18 or more than 110
      if (age < 18 || age > 110) {
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

export const MatchPasswordValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const formGroup = control.parent;
  if (!formGroup) {
    return null;
  }

  const password = formGroup.get('password');
  const confirmPassword = formGroup.get('confirmPassword');

  if (!password || !confirmPassword || password.value !== confirmPassword.value) {
    return { passwordMismatch: true };
  }

  return null;
};