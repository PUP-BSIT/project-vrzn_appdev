export type Card = {
  id: number;
  title: string;
  owner_id: number;
  location: string;
  description: string;
  price: number;
  barangay: string;
  area: number;
  capacity: number;
  city: string;
  images: { image_url: string }[];
  rating: number | null;
  status: boolean;
  bedroom: number;
};
