export type UserRole = 'customer' | 'admin';

export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  facebookId?: string;
  role: UserRole;
  defaultAddress?: string;
  companyName?: string;
  deliveryNotes?: string;
  isPhoneVerified: boolean;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}
