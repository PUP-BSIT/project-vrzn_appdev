export interface Application {
  id: number;
  applicant_id: number;
  created_at: Date;
  notes: string;
  property_id: number;
  status: 'Pending' | 'Approved' | 'Rejected';
}
