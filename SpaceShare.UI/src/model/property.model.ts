export interface Property {
  id: number;
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
  images: string | any;
  owner_id: number;
  [key: string]: string | number | undefined;
}

export interface PropertyResponse {
  createdProperty: {
    area: number;
    barangay: string;
    bedroom: number;
    capacity: number;
    city: string;
    created_at: string;
    description: string;
    id: number;
    owner_id: number;
    postal_code: string;
    price: number;
    province: string | null;
    rating: number | null;
    region: string;
    status: boolean;
    title: string;
    updated_at: string;
  };
  imageArray: Image[];
}

export interface Image {
  id: number;
  property_id: number;
  image_url: string;
}
