export type Card = {
  id: number;
  title: string;
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
