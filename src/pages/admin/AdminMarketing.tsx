import { useRef, useState, type ChangeEvent, type PointerEvent as ReactPointerEvent } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Megaphone, Minus, Pencil, Plus, RotateCcw, Trash2, Upload } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuthStore } from '@/store/auth-store';
import { useMarketingStore } from '@/store/marketing-store';
import { useT } from '@/store/lang-store';
import { useToast } from '@/hooks/use-toast';
import { resolveMarketingImage } from '@/lib/marketing-image';
import type { MarketingBanner } from '@/types/marketing-banner';

const MAX_BANNER_IMAGE_BYTES = 350 * 1024;
const MAX_BANNER_IMAGE_DIMENSION = 1600;
const EMPTY_FORM = {
  title: '',
  summary: '',
  content: '',
  image: '',
  focalX: 50,
  focalY: 50,
  zoom: 100,
  active: true,
};
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const slugifyBanner = (title: string, fallbackId: string) =>
  title
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\p{L}\p{N}\s-]+/gu, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || fallbackId;

const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Image load failed'));
    image.src = src;
  });

const readFileAsDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
        return;
      }

      reject(new Error('File read failed'));
    };
    reader.onerror = () => reject(new Error('File read failed'));
    reader.readAsDataURL(file);
  });

const compressBannerImage = async (file: File) => {
  const source = await readFileAsDataUrl(file);
  const image = await loadImage(source);
  const scale = Math.min(
    1,
    MAX_BANNER_IMAGE_DIMENSION / Math.max(image.width, image.height)
  );

  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(image.width * scale));
  canvas.height = Math.max(1, Math.round(image.height * scale));

  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('Canvas is unavailable');
  }

  context.drawImage(image, 0, 0, canvas.width, canvas.height);

  const attempts = [0.82, 0.72, 0.62, 0.52];
  for (const quality of attempts) {
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, 'image/jpeg', quality)
    );

    if (!blob) continue;
    if (blob.size > MAX_BANNER_IMAGE_BYTES) continue;

    return await readFileAsDataUrl(new File([blob], `${file.name}.jpg`, { type: 'image/jpeg' }));
  }

  throw new Error('Image too large');
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
  const [bannerToDelete, setBannerToDelete] = useState<MarketingBanner | null>(null);
  const [confirmRemoveImageOpen, setConfirmRemoveImageOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const heroPreviewRef = useRef<HTMLDivElement>(null);

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
      focalX: banner.focalX ?? 50,
      focalY: banner.focalY ?? 50,
      zoom: banner.zoom ?? 100,
      active: banner.active,
    });
  };

  const handleSave = () => {
    if (!form.title || !form.summary || !form.content) return;

    const baseSlug = slugifyBanner(form.title, isNew ? `banner-${Date.now()}` : editing?.id || `banner-${Date.now()}`);
    const existingSlugs = new Set(
      banners
        .filter((banner) => banner.id !== editing?.id)
        .map((banner) => banner.slug)
        .filter(Boolean)
    );
    let slug = baseSlug;
    let suffix = 2;
    while (existingSlugs.has(slug)) {
      slug = `${baseSlug}-${suffix}`;
      suffix += 1;
    }

    if (isNew) {
      addBanner({
        id: `banner-${Date.now()}`,
        title: form.title,
        slug,
        summary: form.summary,
        content: form.content,
        image: form.image,
        focalX: form.focalX,
        focalY: form.focalY,
        zoom: form.zoom,
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
        focalX: form.focalX,
        focalY: form.focalY,
        zoom: form.zoom,
        active: form.active,
      });
      toast({ title: t('admin.bannerUpdated') });
    }

    resetForm();
  };

  const handleDelete = () => {
    if (!bannerToDelete) return;
    deleteBanner(bannerToDelete.id);
    toast({ title: t('admin.bannerDeleted') });
    setBannerToDelete(null);
  };

  const onPickImage = () => {
    fileInputRef.current?.click();
  };

  const onImageSelected = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    event.target.value = '';

    void (async () => {
      try {
        const result = await compressBannerImage(file);
        setForm((state) => ({ ...state, image: result }));
        toast({ title: t('admin.imageUpdated') });
      } catch {
        toast({
          title: 'Upload failed',
          description: 'Banner image is too large for browser storage. Use a smaller image.',
          variant: 'destructive',
        });
      }
    })();
  };

  const removeImage = () => {
    setForm((state) => ({ ...state, image: '' }));
    toast({ title: t('admin.imageRemoved') });
    setConfirmRemoveImageOpen(false);
  };

  const updateFocusFromPointer = (clientX: number, clientY: number) => {
    const container = heroPreviewRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    const nextX = clamp(((clientX - rect.left) / rect.width) * 100, 0, 100);
    const nextY = clamp(((clientY - rect.top) / rect.height) * 100, 0, 100);

    setForm((state) => ({ ...state, focalX: nextX, focalY: nextY }));
  };

  const handleHeroPreviewPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    updateFocusFromPointer(event.clientX, event.clientY);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handleHeroPreviewPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!event.buttons) return;
    updateFocusFromPointer(event.clientX, event.clientY);
  };

  const handleHeroPreviewPointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const nudgeFocus = (deltaX: number, deltaY: number) => {
    setForm((state) => ({
      ...state,
      focalX: clamp(state.focalX + deltaX, 0, 100),
      focalY: clamp(state.focalY + deltaY, 0, 100),
    }));
  };

  const adjustZoom = (delta: number) => {
    setForm((state) => ({
      ...state,
      zoom: clamp(state.zoom + delta, 100, 200),
    }));
  };

  const resetImagePosition = () => {
    setForm((state) => ({
      ...state,
      focalX: 50,
      focalY: 50,
      zoom: 100,
    }));
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
                <img
                  src={resolveMarketingImage(banner.image)}
                  alt={banner.title}
                  className="h-40 w-full object-cover md:h-32"
                  style={{
                    objectPosition: `${banner.focalX ?? 50}% ${banner.focalY ?? 50}%`,
                    transform: `scale(${(banner.zoom ?? 100) / 100})`,
                    transformOrigin: `${banner.focalX ?? 50}% ${banner.focalY ?? 50}%`,
                  }}
                />
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
              </div>
              <div className="flex items-center gap-2 md:flex-col">
                <Button variant="outline" onClick={() => toggleBanner(banner.id)} className="font-heading font-semibold">
                  <Megaphone className="mr-2 h-4 w-4" />
                  {banner.active ? t('admin.disableBanner') : t('admin.enableBanner')}
                </Button>
                <Button variant="ghost" size="icon" onClick={() => openEdit(banner)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setBannerToDelete(banner)} className="text-destructive hover:bg-destructive/10 hover:text-destructive">
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
                hidden
                aria-hidden="true"
                tabIndex={-1}
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
                  <div className="space-y-3">
                    <div
                      ref={heroPreviewRef}
                      className="relative mx-auto aspect-[21/11] w-full overflow-hidden rounded-xl border border-border bg-muted touch-none"
                      onPointerDown={handleHeroPreviewPointerDown}
                      onPointerMove={handleHeroPreviewPointerMove}
                      onPointerUp={handleHeroPreviewPointerUp}
                    >
                      <img
                        src={resolveMarketingImage(form.image)}
                        alt={form.title || 'Banner preview'}
                        className="h-full w-full object-cover"
                        style={{
                          objectPosition: `${form.focalX}% ${form.focalY}%`,
                          transform: `scale(${form.zoom / 100})`,
                          transformOrigin: `${form.focalX}% ${form.focalY}%`,
                        }}
                      />
                      <div
                        className="absolute inset-y-0 right-0 z-10 flex w-20 flex-col items-center justify-center gap-2 border-l border-white/10 bg-background/20 px-2 py-3 backdrop-blur-md"
                        onPointerDown={(e) => e.stopPropagation()}
                        onPointerMove={(e) => e.stopPropagation()}
                        onPointerUp={(e) => e.stopPropagation()}
                      >
                        <Button type="button" size="icon" variant="secondary" className="h-9 w-9 bg-background/85" onClick={() => nudgeFocus(0, -5)} title={t('admin.bannerMoveUp')}>
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        <Button type="button" size="icon" variant="secondary" className="h-9 w-9 bg-background/85" onClick={() => nudgeFocus(-5, 0)} title={t('admin.bannerMoveLeft')}>
                          <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <Button type="button" size="icon" variant="secondary" className="h-9 w-9 bg-background/85" onClick={() => nudgeFocus(5, 0)} title={t('admin.bannerMoveRight')}>
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                        <Button type="button" size="icon" variant="secondary" className="h-9 w-9 bg-background/85" onClick={() => nudgeFocus(0, 5)} title={t('admin.bannerMoveDown')}>
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                        <div className="my-1 h-px w-8 bg-white/20" />
                        <Button type="button" size="icon" variant="secondary" className="h-9 w-9 bg-background/85" onClick={() => adjustZoom(-10)} title={t('admin.bannerZoomOut')}>
                          <Minus className="h-4 w-4" />
                        </Button>
                        <div className="text-[10px] font-medium text-white">{Math.round(form.zoom)}%</div>
                        <Button type="button" size="icon" variant="secondary" className="h-9 w-9 bg-background/85" onClick={() => adjustZoom(10)} title={t('admin.bannerZoomIn')}>
                          <Plus className="h-4 w-4" />
                        </Button>
                        <div className="my-1 h-px w-8 bg-white/20" />
                        <Button type="button" size="icon" variant="secondary" className="h-9 w-9 bg-background/85" onClick={resetImagePosition} title={t('common.reset')}>
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">{t('admin.bannerFocusHint')}</p>
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
                    <Button type="button" variant="outline" onClick={() => setConfirmRemoveImageOpen(true)} className="border-destructive/30 bg-destructive/5 text-destructive hover:bg-destructive/15 hover:text-destructive">
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

        <AlertDialog open={!!bannerToDelete} onOpenChange={(open) => { if (!open) setBannerToDelete(null); }}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t('admin.confirmDeleteTitle')}</AlertDialogTitle>
              <AlertDialogDescription>{t('admin.confirmDeleteBanner')}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t('common.no')}</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>{t('common.yes')}</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog open={confirmRemoveImageOpen} onOpenChange={setConfirmRemoveImageOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t('admin.confirmDeleteTitle')}</AlertDialogTitle>
              <AlertDialogDescription>{t('admin.confirmRemoveImage')}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t('common.no')}</AlertDialogCancel>
              <AlertDialogAction onClick={removeImage}>{t('common.yes')}</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Layout>
  );
};

export default AdminMarketing;
