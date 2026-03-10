import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import { Navigate, Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Upload, Trash2 } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore } from '@/store/auth-store';
import { useCategoryStore } from '@/store/category-store';
import { useLangStore, useT } from '@/store/lang-store';
import { useProductStore } from '@/store/product-store';
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
import { getCategoryLabelById, getLocalizedCategoryName } from '@/lib/category-localization';
import { DEFAULT_PRODUCT_IMAGE } from '@/lib/product-image';
import { getLocalizedProductName } from '@/lib/product-localization';

const formatPrice = (price: number) => `₮${price.toLocaleString()}`;

const AdminProductProfile = () => {
  const { user, isAuthenticated } = useAuthStore();
  const t = useT();
  const lang = useLangStore((s) => s.lang);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { id } = useParams();
  const products = useProductStore((s) => s.products);
  const categories = useCategoryStore((s) => s.categories);
  const updateProduct = useProductStore((s) => s.updateProduct);
  const deleteProduct = useProductStore((s) => s.deleteProduct);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const product = products.find((p) => p.id === id);

  const [name, setName] = useState('');
  const [nameMn, setNameMn] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [descriptionMn, setDescriptionMn] = useState('');
  const [inStock, setInStock] = useState(true);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [confirmRemoveImageOpen, setConfirmRemoveImageOpen] = useState(false);

  useEffect(() => {
    if (!product) return;
    setName(product.nameEn || product.name);
    setNameMn(product.nameMn || '');
    setCategory(product.category);
    setPrice(String(product.price));
    setDescription(product.descriptionEn || product.description);
    setDescriptionMn(product.descriptionMn || '');
    setInStock(product.inStock);
  }, [product]);

  if (!isAuthenticated || !user || user.role !== 'admin') return <Navigate to="/login" replace />;

  if (!product) {
    return (
      <Layout>
        <div className="container py-10">
          <Link to="/admin/products" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="h-4 w-4" /> {t('admin.products')}
          </Link>
          <p className="text-muted-foreground">{t('admin.productNotFound')}</p>
        </div>
      </Layout>
    );
  }

  const handleSave = () => {
    if ((!name && !nameMn) || !price || !category) return;
    const primaryName = name.trim() || nameMn.trim();
    const primaryDescription = description.trim() || descriptionMn.trim();
    const slugSource = name.trim() || nameMn.trim();

    updateProduct(product.id, {
      name: primaryName,
      nameEn: name.trim() || undefined,
      nameMn: nameMn.trim() || undefined,
      category,
      description: primaryDescription,
      descriptionEn: description.trim() || undefined,
      descriptionMn: descriptionMn.trim() || undefined,
      price: Number(price),
      inStock,
      slug: slugSource.toLowerCase().replace(/\s+/g, '-'),
    });

    toast({ title: t('admin.productUpdated') });
  };

  const handleDelete = () => {
    deleteProduct(product.id);
    toast({ title: t('admin.productDeleted') });
    navigate('/admin/products');
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
      updateProduct(product.id, { image: result });
      toast({ title: t('admin.imageUpdated') });
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    updateProduct(product.id, { image: '' });
    toast({ title: t('admin.imageRemoved') });
    setConfirmRemoveImageOpen(false);
  };

  return (
    <Layout>
      <div className="container py-10 space-y-8">
        <Link to="/admin/products" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> {t('admin.products')}
        </Link>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="aspect-square rounded-lg overflow-hidden bg-muted border border-border">
              <img
                src={product.image || DEFAULT_PRODUCT_IMAGE}
                alt={getLocalizedProductName(product, lang)}
                className="h-full w-full object-cover"
              />
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              hidden
              aria-hidden="true"
              tabIndex={-1}
              onChange={onImageSelected}
            />

            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={onPickImage}>
                <Upload className="mr-2 h-4 w-4" /> {t('admin.uploadReplaceImage')}
              </Button>
              <Button variant="outline" onClick={() => setConfirmRemoveImageOpen(true)} className="border-destructive/30 bg-destructive/5 text-destructive hover:bg-destructive/15 hover:text-destructive">
                <Trash2 className="mr-2 h-4 w-4" /> {t('admin.removeImage')}
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="font-heading text-3xl font-bold">{getLocalizedProductName(product, lang)}</h1>
            <p className="text-sm text-muted-foreground">
              {getCategoryLabelById(product.category, categories, lang, product.category)}
            </p>
            <p className="font-heading text-xl text-primary">{formatPrice(product.price)}</p>

            <div className="space-y-2">
              <Label>{t('admin.name')} (EN)</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>{t('admin.name')} (MN)</Label>
              <Input value={nameMn} onChange={(e) => setNameMn(e.target.value)} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t('admin.category')}</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('profile.selectOption')} />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {getLocalizedCategoryName(cat, lang)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>{t('admin.price')} (₮)</Label>
                <Input
                  type="number"
                  inputMode="numeric"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t('admin.description')} (EN)</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={7}
                className="min-h-36 leading-relaxed resize-y"
              />
            </div>
            <div className="space-y-2">
              <Label>{t('admin.description')} (MN)</Label>
              <Textarea
                value={descriptionMn}
                onChange={(e) => setDescriptionMn(e.target.value)}
                rows={7}
                className="min-h-36 leading-relaxed resize-y"
              />
            </div>

            <div className="rounded-xl border border-border bg-muted/30 p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <Label htmlFor="stock" className="text-sm font-semibold">
                    {t('admin.stock')}
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    {inStock ? t('admin.inStock') : t('admin.outOfStock')}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${
                      inStock
                        ? 'border-accent/30 bg-accent/15 text-accent'
                        : 'border-destructive/30 bg-destructive/15 text-destructive'
                    }`}
                  >
                    {inStock ? t('admin.inStock') : t('admin.outOfStock')}
                  </span>
                  <Switch
                    id="stock"
                    checked={inStock}
                    onCheckedChange={setInStock}
                    aria-label={t('admin.stock')}
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSave} className="font-heading font-semibold">
                {t('admin.saveChanges')}
              </Button>
              <Button variant="outline" onClick={() => setConfirmDeleteOpen(true)} className="border-destructive/30 bg-destructive/5 text-destructive hover:bg-destructive/15 hover:text-destructive">
                <Trash2 className="mr-2 h-4 w-4" /> {t('admin.delete')}
              </Button>
            </div>
          </div>
        </div>

        <AlertDialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t('admin.confirmDeleteTitle')}</AlertDialogTitle>
              <AlertDialogDescription>
                {t('admin.confirmDeleteProduct')}
              </AlertDialogDescription>
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

export default AdminProductProfile;
