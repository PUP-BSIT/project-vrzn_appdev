// location.model.ts
export interface Region {
  region_code: string;
  region_name: string;
}

export interface Province {
  province_code: string;
  province_name: string;
  region_code: string;
}

export interface City {
  city_code: string;
  city_name: string;
  province_code: string;
}

export interface Barangay {
  brgy_code: string;
  brgy_name: string;
  city_code: string;
}
