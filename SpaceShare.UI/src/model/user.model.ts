export interface PhoneNumber {
  number: string;
  number_type: 'mobile' | 'home' | 'work'; 
}

export interface User {
  first_name: string;
  middle_name: string;
  surname: string;
  birthdate: Date; 
  email: string;
  password: string;
  region: string;
  province: string;
  city: string;
  postal_code: string;
  phone_number: PhoneNumber[];
}

export interface Verificaion {
  code: number;
  mailTo: string
}

export interface SignupResponse {
  success: boolean,
  message: string,
  user: User
}
