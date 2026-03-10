export interface CustomerRecord {
  id: string;
  name: string;
  phone: string;
  email?: string;
  defaultAddress?: string;
  companyName?: string;
  deliveryNotes?: string;
  lastActive: string;
  createdAt: string;
  updatedAt: string;
}
