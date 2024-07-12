import { AbstractControl, ValidationErrors, ValidatorFn, FormControl, FormGroup } from '@angular/forms';

export class CustomValidators {
  static adultAgeValidator(fieldName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const birthdate = control.value;

      if (!birthdate) {
        return null;
      }

      const today = new Date();
      const birthDate = new Date(birthdate);
      const age = today.getFullYear() - birthDate.getFullYear();

      if (age < 18) {
        return { adultAge: { fieldName } };
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
      return { strong: true };
    }
    return null;
  }
}

export class PasswordMatchValidator {
  static passwordsMatch(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.get('password');
      const confirmPassword = control.get('confirmPassword');

      if (!password || !confirmPassword) {
        return null;
      }

      return password.value === confirmPassword.value
        ? null
        : { passwordsMismatch: true };
    };
  }
}
