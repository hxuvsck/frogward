import { useEffect, useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { Package, ShoppingCart, Users, AlertTriangle, Megaphone, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore } from '@/store/auth-store';
import { useCustomerStore } from '@/store/customer-store';
import { useLangStore, useT } from '@/store/lang-store';
import { useMarketingStore } from '@/store/marketing-store';
import { useOrderStore } from '@/store/order-store';
import { useProductStore } from '@/store/product-store';
import { useSiteContentStore } from '@/store/site-content-store';

const AdminDashboard = () => {
  const { user, isAuthenticated } = useAuthStore();
  const t = useT();
  const lang = useLangStore((s) => s.lang);
  const { toast } = useToast();
  if (!isAuthenticated || !user || user.role !== 'admin') return <Navigate to="/login" replace />;

  const orders = useOrderStore((s) => s.orders);
  const products = useProductStore((s) => s.products);
  const customers = useCustomerStore((s) => s.customers);
  const banners = useMarketingStore((s) => s.banners);
  const siteContent = useSiteContentStore();
  const updateContent = useSiteContentStore((s) => s.updateContent);
  const [editorOpen, setEditorOpen] = useState(false);
  const [formState, setFormState] = useState({
    contactDescriptionEn: '',
    contactDescriptionMn: '',
    addressEn: '',
    addressMn: '',
    contactEmail: '',
    contactPhone: '',
  });
  const totalOrders = orders.length;
  const pendingPayment = orders.filter((o) => o.paymentStatus !== 'paid').length;
  const paidOrders = orders.filter((o) => o.paymentStatus === 'paid').length;
  const deliveredOrders = orders.filter((o) => o.status === 'delivered').length;
  const inStockProducts = products.filter((p) => p.inStock).length;
  const lowStock = products.filter((p) => !p.inStock).length;

  useEffect(() => {
    if (!editorOpen) return;

    setFormState({
      contactDescriptionEn: siteContent.contactDescription.en,
      contactDescriptionMn: siteContent.contactDescription.mn,
      addressEn: siteContent.address.en,
      addressMn: siteContent.address.mn,
      contactEmail: siteContent.contactEmail,
      contactPhone: siteContent.contactPhone,
    });
  }, [editorOpen, siteContent]);

  const saveSiteContent = () => {
    updateContent({
      contactDescription: {
        en: formState.contactDescriptionEn,
        mn: formState.contactDescriptionMn,
      },
      address: {
        en: formState.addressEn,
        mn: formState.addressMn,
      },
      contactEmail: formState.contactEmail,
      contactPhone: formState.contactPhone,
    });
    toast({ title: t('admin.siteInfoUpdated') });
    setEditorOpen(false);
  };

  const stats = [
    { label: t('admin.totalOrders'), value: totalOrders, icon: ShoppingCart, color: 'text-primary' },
    { label: t('admin.pendingPayment'), value: pendingPayment, icon: AlertTriangle, color: 'text-primary' },
    { label: t('admin.paidOrders'), value: paidOrders, icon: Package, color: 'text-accent' },
    { label: t('admin.deliveredOrders'), value: deliveredOrders, icon: CheckCircle, color: 'text-accent' },
    { label: t('admin.products'), value: products.length, icon: Package, color: 'text-foreground' },
    { label: t('admin.availableProducts'), value: inStockProducts, icon: Package, color: 'text-primary' },
    { label: t('admin.lowStock'), value: lowStock, icon: AlertTriangle, color: 'text-destructive' },
    { label: t('admin.marketing'), value: banners.length, icon: Megaphone, color: 'text-primary' },
    { label: t('admin.customers'), value: customers.length, icon: Users, color: 'text-foreground' },
  ];

  const navCards = [
    { to: '/admin/orders', icon: ShoppingCart, title: t('admin.manageOrders'), desc: t('admin.manageOrdersDesc') },
    { to: '/admin/products', icon: Package, title: t('admin.manageProducts'), desc: t('admin.manageProductsDesc') },
    { to: '/admin/marketing', icon: Megaphone, title: t('admin.marketing'), desc: t('admin.marketingDesc') },
    { to: '/admin/customers', icon: Users, title: t('admin.customers'), desc: t('admin.customersDesc') },
  ];

  return (
    <Layout>
      <div className="container py-10">
        <div className="mb-8 flex items-center justify-between gap-4">
          <h1 className="font-heading text-3xl font-bold">{t('admin.dashboard')}</h1>
          <Button onClick={() => setEditorOpen(true)} variant="outline" className="font-heading font-semibold">
            {t('admin.editInformation')}
          </Button>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4 mb-10">
          {navCards.map((card, i) => (
            <motion.div
              key={card.to}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 + i * 0.08, duration: 0.3 }}
              whileHover={{ y: -6, scale: 1.02, transition: { duration: 0.2 } }}
            >
              <Link to={card.to} className="block rounded-lg border border-border bg-card p-6 hover:border-primary/30 transition-colors h-full">
                <card.icon className="h-6 w-6 text-primary mb-3" />
                <h3 className="font-heading font-semibold">{card.title}</h3>
                <p className="text-xs text-muted-foreground mt-1">{card.desc}</p>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.05, duration: 0.3 }}
              whileHover={{ y: -4, scale: 1.03, transition: { duration: 0.2 } }}
              className="rounded-lg border border-border bg-card p-4 space-y-2 cursor-default"
            >
              <s.icon className={`h-5 w-5 ${s.color}`} />
              <p className="font-heading text-2xl font-bold">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </motion.div>
          ))}
        </div>

        <Dialog open={editorOpen} onOpenChange={setEditorOpen}>
          <DialogContent className="max-h-[88vh] max-w-2xl overflow-hidden p-0">
            <DialogHeader>
              <DialogTitle className="border-b border-border px-6 py-4 font-heading">
                {t('admin.editInformation')}
              </DialogTitle>
            </DialogHeader>
            <div className="max-h-[calc(88vh-72px)] space-y-6 overflow-y-auto px-6 py-5">
              <div className="rounded-xl border border-border p-4">
                <h2 className="mb-4 font-heading text-lg font-semibold">{t('contact.title')}</h2>
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label>{lang === 'mn' ? 'Мэдэгдэл (EN)' : 'Message (EN)'}</Label>
                    <Textarea value={formState.contactDescriptionEn} onChange={(e) => setFormState((s) => ({ ...s, contactDescriptionEn: e.target.value }))} rows={3} />
                  </div>
                  <div className="space-y-2">
                    <Label>{lang === 'mn' ? 'Мэдэгдэл (MN)' : 'Message (MN)'}</Label>
                    <Textarea value={formState.contactDescriptionMn} onChange={(e) => setFormState((s) => ({ ...s, contactDescriptionMn: e.target.value }))} rows={3} />
                  </div>
                  <div className="space-y-2">
                    <Label>{t('contact.address')} (EN)</Label>
                    <Input value={formState.addressEn} onChange={(e) => setFormState((s) => ({ ...s, addressEn: e.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label>{t('contact.address')} (MN)</Label>
                    <Input value={formState.addressMn} onChange={(e) => setFormState((s) => ({ ...s, addressMn: e.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label>{t('contact.email')}</Label>
                    <Input value={formState.contactEmail} onChange={(e) => setFormState((s) => ({ ...s, contactEmail: e.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label>{t('contact.phone')}</Label>
                    <Input value={formState.contactPhone} onChange={(e) => setFormState((s) => ({ ...s, contactPhone: e.target.value }))} />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={saveSiteContent} className="font-heading font-semibold">
                  {t('admin.saveInformation')}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
