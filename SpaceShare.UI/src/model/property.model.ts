export interface Property {
  title: string;
  price: number;
  bedroom: number;
  capacity: number;
  area: number;
  description?: string;
  region: string;
  city: string;
  postal_code: number;
  barangay: string;
  [key: string]: string | number | undefined;
}
