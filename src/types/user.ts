export type UserRole = 'customer' | 'admin';
export type CustomerType = 'individual' | 'company';

export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  facebookId?: string;
  role: UserRole;
  customerType?: CustomerType;
  defaultAddress?: string;
  companyName?: string;
  companyRegistrationNumber?: string;
  businessSector?: string;
  employeeCount?: string;
  jobTitle?: string;
  companyEmail?: string;
  companyPhone?: string;
  deliveryNotes?: string;
  isPhoneVerified: boolean;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}
