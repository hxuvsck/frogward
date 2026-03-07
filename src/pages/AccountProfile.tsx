import { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/store/auth-store';
import { useToast } from '@/hooks/use-toast';

const AccountProfile = () => {
  const { user, isAuthenticated, updateProfile } = useAuthStore();
  const { toast } = useToast();

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
    toast({ title: 'Profile updated', description: 'Your changes have been saved.' });
  };

  return (
    <Layout>
      <div className="container py-10 max-w-2xl">
        <Link to="/account" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" /> Back to Account
        </Link>
        <h1 className="font-heading text-3xl font-bold mb-8">Edit Profile</h1>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="rounded-lg border border-border bg-card p-6 space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Company Name</Label>
                <Input id="company" value={company} onChange={(e) => setCompany(e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Default Delivery Address</Label>
              <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Delivery Notes</Label>
              <Input id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Gate code, floor, etc." />
            </div>
          </div>

          <Button type="submit" className="font-heading font-semibold">
            <Save className="mr-2 h-4 w-4" /> Save Changes
          </Button>
        </form>
      </div>
    </Layout>
  );
};

export default AccountProfile;
