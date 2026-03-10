import { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/store/auth-store';
import { useToast } from '@/hooks/use-toast';
import { useT } from '@/store/lang-store';
import type { CustomerType } from '@/types/user';

const BUSINESS_SECTORS = [
  'construction',
  'mining',
  'manufacturing',
  'logistics',
  'energy',
  'retail',
  'other',
] as const;

const EMPLOYEE_RANGES = ['1-10', '11-50', '51-200', '201-500', '500+'] as const;

type ProfileErrors = Partial<Record<
  | 'name'
  | 'phone'
  | 'address'
  | 'company'
  | 'companyRegistrationNumber'
  | 'businessSector'
  | 'employeeCount'
  | 'jobTitle'
  | 'companyEmail',
  boolean
>>;

const AccountProfile = () => {
  const { user, isAuthenticated, updateProfile } = useAuthStore();
  const { toast } = useToast();
  const t = useT();

  const [customerType, setCustomerType] = useState<CustomerType>(user?.customerType || 'individual');
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [email, setEmail] = useState(user?.email || '');
  const [address, setAddress] = useState(user?.defaultAddress || '');
  const [company, setCompany] = useState(user?.companyName || '');
  const [companyRegistrationNumber, setCompanyRegistrationNumber] = useState(user?.companyRegistrationNumber || '');
  const [businessSector, setBusinessSector] = useState(user?.businessSector || '');
  const [employeeCount, setEmployeeCount] = useState(user?.employeeCount || '');
  const [jobTitle, setJobTitle] = useState(user?.jobTitle || '');
  const [companyEmail, setCompanyEmail] = useState(user?.companyEmail || '');
  const [companyPhone, setCompanyPhone] = useState(user?.companyPhone || '');
  const [notes, setNotes] = useState(user?.deliveryNotes || '');
  const [errors, setErrors] = useState<ProfileErrors>({});

  if (!isAuthenticated || !user) return <Navigate to="/login" replace />;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: ProfileErrors = {};

    if (!name.trim()) nextErrors.name = true;
    if (!phone.trim()) nextErrors.phone = true;
    if (!address.trim()) nextErrors.address = true;

    if (customerType === 'company') {
      if (!company.trim()) nextErrors.company = true;
      if (!companyRegistrationNumber.trim()) nextErrors.companyRegistrationNumber = true;
      if (!businessSector.trim()) nextErrors.businessSector = true;
      if (!employeeCount.trim()) nextErrors.employeeCount = true;
      if (!jobTitle.trim()) nextErrors.jobTitle = true;
      if (!companyEmail.trim()) nextErrors.companyEmail = true;
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      toast({
        variant: 'destructive',
        title: t('profile.requiredTitle'),
        description: t('profile.requiredDesc'),
      });
      return;
    }

    updateProfile({
      customerType,
      name,
      phone,
      email: email || undefined,
      defaultAddress: address || undefined,
      companyName: customerType === 'company' ? company || undefined : undefined,
      companyRegistrationNumber: customerType === 'company' ? companyRegistrationNumber || undefined : undefined,
      businessSector: customerType === 'company' ? businessSector || undefined : undefined,
      employeeCount: customerType === 'company' ? employeeCount || undefined : undefined,
      jobTitle: customerType === 'company' ? jobTitle || undefined : undefined,
      companyEmail: customerType === 'company' ? companyEmail || undefined : undefined,
      companyPhone: customerType === 'company' ? companyPhone || undefined : undefined,
      deliveryNotes: notes || undefined,
    });
    setErrors({});
    toast({ title: t('profile.saved'), description: t('profile.savedDesc') });
  };

  return (
    <Layout>
      <div className="container py-10 max-w-2xl">
        <Link to="/account" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" /> {t('common.backToAccount')}
        </Link>
        <h1 className="font-heading text-3xl font-bold mb-8">{t('profile.title')}</h1>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="rounded-lg border border-border bg-card p-6 space-y-4">
            <p className="text-sm text-muted-foreground">{t('profile.requiredNote')}</p>

            <div className="space-y-3">
              <Label>{t('profile.customerType')}</Label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setCustomerType('individual')}
                  className={`rounded-lg border px-4 py-3 text-sm font-medium transition-colors ${customerType === 'individual' ? 'border-primary bg-primary/10 text-foreground' : 'border-border text-muted-foreground hover:border-primary/30'}`}
                >
                  {t('profile.individual')}
                </button>
                <button
                  type="button"
                  onClick={() => setCustomerType('company')}
                  className={`rounded-lg border px-4 py-3 text-sm font-medium transition-colors ${customerType === 'company' ? 'border-primary bg-primary/10 text-foreground' : 'border-border text-muted-foreground hover:border-primary/30'}`}
                >
                  {t('profile.companyCustomer')}
                </button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t('profile.fullName')}</Label>
                <Input id="name" value={name} onChange={(e) => {
                  setName(e.target.value);
                  setErrors((state) => ({ ...state, name: undefined }));
                }} />
                {errors.name ? <p className="text-sm text-destructive">{t('profile.fillRequired')}</p> : null}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">{t('profile.phone')}</Label>
                <Input id="phone" value={phone} onChange={(e) => {
                  setPhone(e.target.value);
                  setErrors((state) => ({ ...state, phone: undefined }));
                }} />
                {errors.phone ? <p className="text-sm text-destructive">{t('profile.fillRequired')}</p> : null}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">{t('profile.email')}</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">{t('profile.company')}</Label>
                <Input id="company" value={company} onChange={(e) => {
                  setCompany(e.target.value);
                  setErrors((state) => ({ ...state, company: undefined }));
                }} disabled={customerType !== 'company'} />
                {customerType === 'company' && errors.company ? <p className="text-sm text-destructive">{t('profile.fillRequired')}</p> : null}
              </div>
            </div>

            {customerType === 'company' && (
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companyRegistrationNumber">{t('profile.companyRegistrationNumber')}</Label>
                  <Input id="companyRegistrationNumber" value={companyRegistrationNumber} onChange={(e) => {
                    setCompanyRegistrationNumber(e.target.value);
                    setErrors((state) => ({ ...state, companyRegistrationNumber: undefined }));
                  }} />
                  {errors.companyRegistrationNumber ? <p className="text-sm text-destructive">{t('profile.fillRequired')}</p> : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessSector">{t('profile.businessSector')}</Label>
                  <select
                    id="businessSector"
                    value={businessSector}
                    onChange={(e) => {
                      setBusinessSector(e.target.value);
                      setErrors((state) => ({ ...state, businessSector: undefined }));
                    }}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground"
                  >
                    <option value="">{t('profile.selectOption')}</option>
                    {BUSINESS_SECTORS.map((sector) => (
                      <option key={sector} value={sector}>
                        {t(`profile.sector.${sector}`)}
                      </option>
                    ))}
                  </select>
                  {errors.businessSector ? <p className="text-sm text-destructive">{t('profile.fillRequired')}</p> : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="employeeCount">{t('profile.employeeCount')}</Label>
                  <select
                    id="employeeCount"
                    value={employeeCount}
                    onChange={(e) => {
                      setEmployeeCount(e.target.value);
                      setErrors((state) => ({ ...state, employeeCount: undefined }));
                    }}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground"
                  >
                    <option value="">{t('profile.selectOption')}</option>
                    {EMPLOYEE_RANGES.map((range) => (
                      <option key={range} value={range}>
                        {range}
                      </option>
                    ))}
                  </select>
                  {errors.employeeCount ? <p className="text-sm text-destructive">{t('profile.fillRequired')}</p> : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jobTitle">{t('profile.jobTitle')}</Label>
                  <Input id="jobTitle" value={jobTitle} onChange={(e) => {
                    setJobTitle(e.target.value);
                    setErrors((state) => ({ ...state, jobTitle: undefined }));
                  }} />
                  {errors.jobTitle ? <p className="text-sm text-destructive">{t('profile.fillRequired')}</p> : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyEmail">{t('profile.companyEmail')}</Label>
                  <Input id="companyEmail" type="email" value={companyEmail} onChange={(e) => {
                    setCompanyEmail(e.target.value);
                    setErrors((state) => ({ ...state, companyEmail: undefined }));
                  }} />
                  {errors.companyEmail ? <p className="text-sm text-destructive">{t('profile.fillRequired')}</p> : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyPhone">{t('profile.companyPhone')}</Label>
                  <Input id="companyPhone" value={companyPhone} onChange={(e) => setCompanyPhone(e.target.value)} />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="address">{t('profile.address')}</Label>
              <Input id="address" value={address} onChange={(e) => {
                setAddress(e.target.value);
                setErrors((state) => ({ ...state, address: undefined }));
              }} />
              {errors.address ? <p className="text-sm text-destructive">{t('profile.fillRequired')}</p> : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">{t('profile.notes')}</Label>
              <Input id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder={t('profile.notesPlaceholder')} />
            </div>
          </div>

          <Button type="submit" className="font-heading font-semibold">
            <Save className="mr-2 h-4 w-4" /> {t('profile.save')}
          </Button>
        </form>
      </div>
    </Layout>
  );
};

export default AccountProfile;
