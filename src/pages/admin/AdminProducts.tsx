import { useRef, useState, type ChangeEvent } from 'react';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Pencil, Trash2, Upload } from 'lucide-react';
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
import { categories } from '@/data/mock-products';
import { useAuthStore } from '@/store/auth-store';
import { useOrderStore } from '@/store/order-store';
import { useLangStore, useT } from '@/store/lang-store';
import { useProductStore } from '@/store/product-store';
import type { Product } from '@/types/product';
import { getCategoryLabel } from '@/lib/category-label';
import { DEFAULT_PRODUCT_IMAGE } from '@/lib/product-image';
import { getLocalizedProductName, matchesProductSearch } from '@/lib/product-localization';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

const formatPrice = (p: number) => `₮${p.toLocaleString()}`;

const AdminProducts = () => {
  const { user, isAuthenticated } = useAuthStore();
  const { toast } = useToast();
  const t = useT();
  const lang = useLangStore((s) => s.lang);
  const navigate = useNavigate();
  const orders = useOrderStore((s) => s.orders);
  const productList = useProductStore((s) => s.products);
  const addProduct = useProductStore((s) => s.addProduct);
  const updateProduct = useProductStore((s) => s.updateProduct);
  const deleteProduct = useProductStore((s) => s.deleteProduct);
  const toggleStock = useProductStore((s) => s.toggleStock);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<Product | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [formName, setFormName] = useState('');
  const [formNameMn, setFormNameMn] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formCategory, setFormCategory] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formDescMn, setFormDescMn] = useState('');
  const [formInStock, setFormInStock] = useState(true);
  const [formImage, setFormImage] = useState('');
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [confirmRemoveImageOpen, setConfirmRemoveImageOpen] = useState(false);

  if (!isAuthenticated || !user || user.role !== 'admin') return <Navigate to="/login" replace />;

  const filtered = productList.filter((p) => matchesProductSearch(p, search));

  const openEdit = (product: Product) => {
    setEditing(product);
    setIsNew(false);
    setFormName(product.nameEn || product.name);
    setFormNameMn(product.nameMn || '');
    setFormPrice(String(product.price));
    setFormCategory(product.category);
    setFormDesc(product.descriptionEn || product.description);
    setFormDescMn(product.descriptionMn || '');
    setFormInStock(product.inStock);
    setFormImage(product.image || '');
  };

  const openCreate = () => {
    setEditing(null);
    setIsNew(true);
    setFormName('');
    setFormNameMn('');
    setFormPrice('');
    setFormCategory(categories[0]?.id ?? '');
    setFormDesc('');
    setFormDescMn('');
    setFormInStock(true);
    setFormImage('');
  };

  const handleSave = () => {
    if ((!formName && !formNameMn) || !formPrice || !formCategory) return;
    const primaryName = formName.trim() || formNameMn.trim();
    const primaryDescription = formDesc.trim() || formDescMn.trim();
    const slugSource = formName.trim() || formNameMn.trim();

    if (isNew) {
      const newProduct: Product = {
        id: `new-${Date.now()}`,
        slug: slugSource.toLowerCase().replace(/\s+/g, '-'),
        name: primaryName,
        nameEn: formName.trim() || undefined,
        nameMn: formNameMn.trim() || undefined,
        price: Number(formPrice),
        category: formCategory,
        description: primaryDescription,
        descriptionEn: formDesc.trim() || undefined,
        descriptionMn: formDescMn.trim() || undefined,
        inStock: formInStock,
        image: formImage || DEFAULT_PRODUCT_IMAGE,
      };
      addProduct(newProduct);
      toast({ title: t('admin.productCreated') });
    } else if (editing) {
      updateProduct(editing.id, {
        name: primaryName,
        nameEn: formName.trim() || undefined,
        nameMn: formNameMn.trim() || undefined,
        price: Number(formPrice),
        category: formCategory,
        description: primaryDescription,
        descriptionEn: formDesc.trim() || undefined,
        descriptionMn: formDescMn.trim() || undefined,
        inStock: formInStock,
        image: formImage || '',
        slug: slugSource.toLowerCase().replace(/\s+/g, '-'),
      });
      toast({ title: t('admin.productUpdated') });
    }

    setEditing(null);
    setIsNew(false);
    setFormNameMn('');
    setFormDescMn('');
    setFormImage('');
  };

  const handleDelete = () => {
    if (!productToDelete) return;
    deleteProduct(productToDelete.id);
    toast({ title: t('admin.productDeleted') });
    setProductToDelete(null);
  };

  const totalSold = (productId: string) =>
    orders
      .flatMap((o) => o.items)
      .filter((i) => i.productId === productId)
      .reduce((sum, i) => sum + i.quantity, 0);

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
      setFormImage(result);
      toast({ title: t('admin.imageUpdated') });
    };
    reader.readAsDataURL(file);
    event.target.value = '';
  };

  const removeImage = () => {
    setFormImage('');
    toast({ title: t('admin.imageRemoved') });
    setConfirmRemoveImageOpen(false);
  };

  return (
    <Layout>
      <div className="container py-10">
        <Link to="/admin" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" /> {t('common.dashboard')}
        </Link>

        <div className="flex items-center justify-between mb-6">
          <h1 className="font-heading text-3xl font-bold">{t('admin.products')}</h1>
          <Button onClick={openCreate} className="font-heading font-semibold">
            <Plus className="mr-2 h-4 w-4" /> {t('admin.addProduct')}
          </Button>
        </div>

        <Input placeholder={t('admin.searchProducts')} value={search} onChange={(e) => setSearch(e.target.value)} className="mb-6 max-w-sm" />

        <div className="rounded-lg border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left px-4 py-3 font-heading font-semibold text-xs uppercase tracking-wider text-muted-foreground">{t('admin.product')}</th>
                  <th className="text-left px-4 py-3 font-heading font-semibold text-xs uppercase tracking-wider text-muted-foreground">{t('admin.category')}</th>
                  <th className="text-left px-4 py-3 font-heading font-semibold text-xs uppercase tracking-wider text-muted-foreground">{t('admin.price')}</th>
                  <th className="text-left px-4 py-3 font-heading font-semibold text-xs uppercase tracking-wider text-muted-foreground">{t('admin.sold')}</th>
                  <th className="text-left px-4 py-3 font-heading font-semibold text-xs uppercase tracking-wider text-muted-foreground">{t('admin.stock')}</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((product) => (
                  <tr
                    key={product.id}
                    className="hover:bg-muted/30 transition-colors cursor-pointer"
                    onClick={() => navigate(`/admin/products/${product.id}`)}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={product.image || DEFAULT_PRODUCT_IMAGE} alt={getLocalizedProductName(product, lang)} className="h-10 w-10 rounded object-cover bg-muted" />
                        <span className="font-heading font-semibold">{getLocalizedProductName(product, lang)}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground capitalize">
                      {getCategoryLabel(product.category, t, product.category)}
                    </td>
                    <td className="px-4 py-3 font-heading font-semibold text-primary">{formatPrice(product.price)}</td>
                    <td className="px-4 py-3 text-muted-foreground">{totalSold(product.id)}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleStock(product.id);
                        }}
                        className={`text-xs px-2 py-0.5 rounded-full ${product.inStock ? 'bg-accent/20 text-accent' : 'bg-destructive/20 text-destructive'}`}
                      >
                        {product.inStock ? t('admin.inStock') : t('admin.outOfStock')}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            openEdit(product);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            setProductToDelete(product);
                          }}
                          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && <p className="text-center text-muted-foreground py-8">{t('admin.noProducts')}</p>}
        </div>

        <Dialog open={isNew || !!editing} onOpenChange={() => { setEditing(null); setIsNew(false); setFormImage(''); }}>
          <DialogContent className="max-h-[88vh] max-w-2xl overflow-hidden p-0">
            <DialogHeader>
              <DialogTitle className="border-b border-border px-6 py-4 font-heading">
                {isNew ? t('admin.createProduct') : t('admin.editProduct')}
              </DialogTitle>
            </DialogHeader>
            <div className="max-h-[calc(88vh-72px)] overflow-y-auto px-6 py-5">
              <div className="space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                hidden
                aria-hidden="true"
                tabIndex={-1}
                onChange={onImageSelected}
              />
              <div className="space-y-3">
                <div className="overflow-hidden rounded-lg border border-border bg-muted">
                  <img
                    src={formImage || DEFAULT_PRODUCT_IMAGE}
                    alt={formName || t('admin.product')}
                    className="h-40 w-full object-cover md:h-52"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button type="button" variant="outline" onClick={onPickImage}>
                    <Upload className="mr-2 h-4 w-4" /> {t('admin.uploadReplaceImage')}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setConfirmRemoveImageOpen(true)} className="border-destructive/30 bg-destructive/5 text-destructive hover:bg-destructive/15 hover:text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" /> {t('admin.removeImage')}
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>{t('admin.name')} (EN)</Label>
                <Input value={formName} onChange={(e) => setFormName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>{t('admin.name')} (MN)</Label>
                <Input value={formNameMn} onChange={(e) => setFormNameMn(e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t('admin.price')} (₮)</Label>
                  <Input
                    type="number"
                    inputMode="numeric"
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t('admin.category')}</Label>
                  <Select value={formCategory} onValueChange={setFormCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('profile.selectOption')} />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {getCategoryLabel(cat.id, t, cat.name)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>{t('admin.description')} (EN)</Label>
                <Textarea
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  rows={5}
                  className="min-h-28 leading-relaxed resize-y"
                />
              </div>
              <div className="space-y-2">
                <Label>{t('admin.description')} (MN)</Label>
                <Textarea
                  value={formDescMn}
                  onChange={(e) => setFormDescMn(e.target.value)}
                  rows={5}
                  className="min-h-28 leading-relaxed resize-y"
                />
              </div>
              <div className="rounded-xl border border-border bg-muted/30 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="inStock" className="text-sm font-semibold">
                      {t('admin.stock')}
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      {formInStock ? t('admin.inStock') : t('admin.outOfStock')}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${
                        formInStock
                          ? 'border-accent/30 bg-accent/15 text-accent'
                          : 'border-destructive/30 bg-destructive/15 text-destructive'
                      }`}
                    >
                      {formInStock ? t('admin.inStock') : t('admin.outOfStock')}
                    </span>
                    <Switch
                      id="inStock"
                      checked={formInStock}
                      onCheckedChange={setFormInStock}
                      aria-label={t('admin.stock')}
                    />
                  </div>
                </div>
              </div>
              <Button onClick={handleSave} className="w-full font-heading font-semibold">
                {isNew ? t('admin.createProduct') : t('admin.saveChanges')}
              </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <AlertDialog open={!!productToDelete} onOpenChange={(open) => { if (!open) setProductToDelete(null); }}>
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

export default AdminProducts;
