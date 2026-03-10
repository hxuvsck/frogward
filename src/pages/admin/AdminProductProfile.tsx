import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import { Navigate, Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Upload, Trash2 } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { categories } from '@/data/mock-products';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore } from '@/store/auth-store';
import { useT } from '@/store/lang-store';
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
import { getCategoryLabel } from '@/lib/category-label';
import { DEFAULT_PRODUCT_IMAGE } from '@/lib/product-image';

const formatPrice = (price: number) => `₮${price.toLocaleString()}`;

const AdminProductProfile = () => {
  const { user, isAuthenticated } = useAuthStore();
  const t = useT();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { id } = useParams();
  const products = useProductStore((s) => s.products);
  const updateProduct = useProductStore((s) => s.updateProduct);
  const deleteProduct = useProductStore((s) => s.deleteProduct);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const product = products.find((p) => p.id === id);

  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [inStock, setInStock] = useState(true);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [confirmRemoveImageOpen, setConfirmRemoveImageOpen] = useState(false);

  useEffect(() => {
    if (!product) return;
    setName(product.name);
    setCategory(product.category);
    setPrice(String(product.price));
    setDescription(product.description);
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
    if (!name || !price || !category) return;

    updateProduct(product.id, {
      name,
      category,
      description,
      price: Number(price),
      inStock,
      slug: name.toLowerCase().replace(/\s+/g, '-'),
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
                alt={product.name}
                className="h-full w-full object-cover"
              />
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onImageSelected}
            />

            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={onPickImage}>
                <Upload className="mr-2 h-4 w-4" /> {t('admin.uploadReplaceImage')}
              </Button>
              <Button variant="outline" onClick={() => setConfirmRemoveImageOpen(true)}>
                <Trash2 className="mr-2 h-4 w-4" /> {t('admin.removeImage')}
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="font-heading text-3xl font-bold">{product.name}</h1>
            <p className="text-sm text-muted-foreground">
              {getCategoryLabel(product.category, t, product.category)}
            </p>
            <p className="font-heading text-xl text-primary">{formatPrice(product.price)}</p>

            <div className="space-y-2">
              <Label>{t('admin.name')}</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t('admin.category')}</Label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {getCategoryLabel(cat.id, t, cat.name)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>{t('admin.price')} (₮)</Label>
                <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t('admin.description')}</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={7}
                className="min-h-36 leading-relaxed resize-y"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                id="stock"
                type="checkbox"
                checked={inStock}
                onChange={(e) => setInStock(e.target.checked)}
                className="rounded"
              />
              <Label htmlFor="stock">{t('admin.inStock')}</Label>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSave} className="font-heading font-semibold">
                {t('admin.saveChanges')}
              </Button>
              <Button variant="outline" onClick={() => setConfirmDeleteOpen(true)} className="text-destructive hover:text-destructive">
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
