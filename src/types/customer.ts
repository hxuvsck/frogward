export interface CustomerRecord {
  id: string;
  name: string;
  phone: string;
  email?: string;
  customerType?: 'individual' | 'company';
  defaultAddress?: string;
  companyName?: string;
  companyRegistrationNumber?: string;
  businessSector?: string;
  employeeCount?: string;
  jobTitle?: string;
  companyEmail?: string;
  companyPhone?: string;
  deliveryNotes?: string;
  lastActive: string;
  createdAt: string;
  updatedAt: string;
}
