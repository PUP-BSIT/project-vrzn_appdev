export interface Reservation {
  property_id: number;
  applicant_id: number;
  status: string;
  notes: string;
  created_at?: string;
}