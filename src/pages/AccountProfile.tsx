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

const AccountProfile = () => {
  const { user, isAuthenticated, updateProfile } = useAuthStore();
  const { toast } = useToast();
  const t = useT();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [email, setEmail] = useState(user?.email || '');
  const [address, setAddress] = useState(user?.defaultAddress || '');
  const [company, setCompany] = useState(user?.companyName || '');
  const [notes, setNotes] = useState(user?.deliveryNotes || '');

  if (!isAuthenticated || !user) return <Navigate to="/login" replace />;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ name, phone, email: email || undefined, defaultAddress: address || undefined, companyName: company || undefined, deliveryNotes: notes || undefined });
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
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t('profile.fullName')}</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">{t('profile.phone')}</Label>
                <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">{t('profile.email')}</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">{t('profile.company')}</Label>
                <Input id="company" value={company} onChange={(e) => setCompany(e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">{t('profile.address')}</Label>
              <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} />
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
