import { useRef, useState, type ChangeEvent } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { ArrowLeft, Megaphone, Pencil, Plus, Trash2, Upload } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuthStore } from '@/store/auth-store';
import { useMarketingStore } from '@/store/marketing-store';
import { useT } from '@/store/lang-store';
import { useToast } from '@/hooks/use-toast';
import type { MarketingBanner } from '@/types/marketing-banner';

const EMPTY_FORM = {
  title: '',
  summary: '',
  content: '',
  image: '',
  active: true,
};

const AdminMarketing = () => {
  const { user, isAuthenticated } = useAuthStore();
  const { toast } = useToast();
  const t = useT();
  const banners = useMarketingStore((s) => s.banners);
  const addBanner = useMarketingStore((s) => s.addBanner);
  const updateBanner = useMarketingStore((s) => s.updateBanner);
  const deleteBanner = useMarketingStore((s) => s.deleteBanner);
  const toggleBanner = useMarketingStore((s) => s.toggleBanner);

  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<MarketingBanner | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isAuthenticated || !user || user.role !== 'admin') return <Navigate to="/login" replace />;

  const filtered = banners.filter((banner) =>
    [banner.title, banner.summary, banner.content, banner.image]
      .filter(Boolean)
      .some((value) => value!.toLowerCase().includes(search.toLowerCase()))
  );

  const resetForm = () => {
    setEditing(null);
    setIsNew(false);
    setForm(EMPTY_FORM);
  };

  const openCreate = () => {
    setEditing(null);
    setIsNew(true);
    setForm(EMPTY_FORM);
  };

  const openEdit = (banner: MarketingBanner) => {
    setEditing(banner);
    setIsNew(false);
    setForm({
      title: banner.title,
      summary: banner.summary,
      content: banner.content,
      image: banner.image,
      active: banner.active,
    });
  };

  const handleSave = () => {
    if (!form.title || !form.summary || !form.content || !form.image) return;

    const slug = form.title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');

    if (isNew) {
      addBanner({
        id: `banner-${Date.now()}`,
        title: form.title,
        slug,
        summary: form.summary,
        content: form.content,
        image: form.image,
        active: form.active,
      });
      toast({ title: t('admin.bannerCreated') });
    } else if (editing) {
      updateBanner(editing.id, {
        title: form.title,
        slug,
        summary: form.summary,
        content: form.content,
        image: form.image,
        active: form.active,
      });
      toast({ title: t('admin.bannerUpdated') });
    }

    resetForm();
  };

  const handleDelete = (id: string) => {
    deleteBanner(id);
    toast({ title: t('admin.bannerDeleted') });
  };

  const onPickImage = () => {
    fileInputRef.current?.click();
  };

  const onImageSelected = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : '';
      if (!result) return;
      setForm((state) => ({ ...state, image: result }));
      toast({ title: t('admin.imageUpdated') });
    };
    reader.readAsDataURL(file);
    event.target.value = '';
  };

  const removeImage = () => {
    setForm((state) => ({ ...state, image: '' }));
    toast({ title: t('admin.imageRemoved') });
  };

  return (
    <Layout>
      <div className="container py-10">
        <Link to="/admin" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" /> {t('common.dashboard')}
        </Link>

        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h1 className="font-heading text-3xl font-bold">{t('admin.marketing')}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{t('admin.marketingDesc')}</p>
          </div>
          <Button onClick={openCreate} className="font-heading font-semibold">
            <Plus className="mr-2 h-4 w-4" /> {t('admin.addBanner')}
          </Button>
        </div>

        <Input
          placeholder={t('admin.searchBanners')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-6 max-w-sm"
        />

        <div className="grid gap-4">
          {filtered.map((banner) => (
            <article key={banner.id} className="grid gap-4 overflow-hidden rounded-2xl border border-border bg-card p-4 md:grid-cols-[240px_1fr_auto] md:items-center">
              <div className="overflow-hidden rounded-xl bg-muted">
                <img src={banner.image} alt={banner.title} className="h-40 w-full object-cover md:h-32" />
              </div>
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${banner.active ? 'bg-accent/15 text-accent' : 'bg-muted text-muted-foreground'}`}>
                    {banner.active ? t('admin.active') : t('admin.inactive')}
                  </span>
                </div>
                <div>
                  <h2 className="font-heading text-xl font-bold">{banner.title}</h2>
                  <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">{banner.summary}</p>
                </div>
                <p className="text-xs text-muted-foreground">
                  /stories/{banner.slug}
                </p>
                <p className="break-all text-xs text-muted-foreground">
                  {banner.image}
                </p>
              </div>
              <div className="flex items-center gap-2 md:flex-col">
                <Button variant="outline" onClick={() => toggleBanner(banner.id)} className="font-heading font-semibold">
                  <Megaphone className="mr-2 h-4 w-4" />
                  {banner.active ? t('admin.disableBanner') : t('admin.enableBanner')}
                </Button>
                <Button variant="ghost" size="icon" onClick={() => openEdit(banner)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(banner.id)} className="text-destructive hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </article>
          ))}
          {filtered.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-border py-12 text-center text-muted-foreground">
              {t('admin.noBanners')}
            </p>
          ) : null}
        </div>

        <Dialog open={isNew || !!editing} onOpenChange={resetForm}>
          <DialogContent className="max-h-[88vh] max-w-2xl overflow-hidden p-0">
            <DialogHeader>
              <DialogTitle className="border-b border-border px-6 py-4 font-heading">
                {isNew ? t('admin.createBanner') : t('admin.editBanner')}
              </DialogTitle>
            </DialogHeader>
            <div className="max-h-[calc(88vh-72px)] overflow-y-auto px-6 py-5">
              <div className="grid gap-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onImageSelected}
              />

              <div className="space-y-2">
                <Label>{t('admin.bannerTitle')}</Label>
                <Input value={form.title} onChange={(e) => setForm((state) => ({ ...state, title: e.target.value }))} />
              </div>

              <div className="space-y-2">
                <Label>{t('admin.bannerSummary')}</Label>
                <Textarea
                  value={form.summary}
                  onChange={(e) => setForm((state) => ({ ...state, summary: e.target.value }))}
                  rows={3}
                  className="min-h-24 resize-y"
                />
              </div>

              <div className="space-y-2">
                <Label>{t('admin.bannerContent')}</Label>
                <Textarea
                  value={form.content}
                  onChange={(e) => setForm((state) => ({ ...state, content: e.target.value }))}
                  rows={8}
                  className="min-h-40 resize-y"
                />
              </div>

              <div className="space-y-2">
                <Label>{t('admin.bannerImage')}</Label>
                {form.image ? (
                  <div className="overflow-hidden rounded-xl border border-border bg-muted">
                    <img src={form.image} alt={form.title || 'Banner preview'} className="h-48 w-full object-cover" />
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-border bg-muted/40 px-4 py-10 text-center text-sm text-muted-foreground">
                    {t('admin.noBannerImage')}
                  </div>
                )}
                <div className="flex flex-wrap gap-2">
                  <Button type="button" variant="outline" onClick={onPickImage}>
                    <Upload className="mr-2 h-4 w-4" /> {t('admin.uploadReplaceImage')}
                  </Button>
                  {form.image ? (
                    <Button type="button" variant="outline" onClick={removeImage}>
                      <Trash2 className="mr-2 h-4 w-4" /> {t('admin.removeImage')}
                    </Button>
                  ) : null}
                </div>
              </div>

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(e) => setForm((state) => ({ ...state, active: e.target.checked }))}
                  className="rounded"
                />
                {t('admin.active')}
              </label>

              <Button onClick={handleSave} className="w-full font-heading font-semibold">
                {isNew ? t('admin.createBanner') : t('admin.saveChanges')}
              </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default AdminMarketing;
