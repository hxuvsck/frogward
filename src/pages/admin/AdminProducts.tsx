import { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Pencil, Archive, Star } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/store/auth-store';
import { products as initialProducts } from '@/data/mock-products';
import type { Product } from '@/types/product';
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
  if (!isAuthenticated || !user || user.role !== 'admin') return <Navigate to="/login" replace />;

  const [productList, setProductList] = useState<Product[]>(initialProducts);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<Product | null>(null);
  const [isNew, setIsNew] = useState(false);

  // Form state
  const [formName, setFormName] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formCategory, setFormCategory] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formInStock, setFormInStock] = useState(true);

  const filtered = productList.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const openEdit = (product: Product) => {
    setEditing(product);
    setIsNew(false);
    setFormName(product.name);
    setFormPrice(String(product.price));
    setFormCategory(product.category);
    setFormDesc(product.description);
    setFormInStock(product.inStock);
  };

  const openCreate = () => {
    setEditing(null);
    setIsNew(true);
    setFormName('');
    setFormPrice('');
    setFormCategory('');
    setFormDesc('');
    setFormInStock(true);
  };

  const handleSave = () => {
    if (!formName || !formPrice) return;
    if (isNew) {
      const newProduct: Product = {
        id: `new-${Date.now()}`,
        slug: formName.toLowerCase().replace(/\s+/g, '-'),
        name: formName,
        price: Number(formPrice),
        category: formCategory,
        description: formDesc,
        inStock: formInStock,
        image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&h=600&fit=crop',
      };
      setProductList((prev) => [newProduct, ...prev]);
      toast({ title: 'Product created' });
    } else if (editing) {
      setProductList((prev) =>
        prev.map((p) =>
          p.id === editing.id
            ? { ...p, name: formName, price: Number(formPrice), category: formCategory, description: formDesc, inStock: formInStock }
            : p
        )
      );
      toast({ title: 'Product updated' });
    }
    setEditing(null);
    setIsNew(false);
  };

  const toggleStock = (id: string) => {
    setProductList((prev) => prev.map((p) => p.id === id ? { ...p, inStock: !p.inStock } : p));
  };

  return (
    <Layout>
      <div className="container py-10">
        <Link to="/admin" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" /> Dashboard
        </Link>

        <div className="flex items-center justify-between mb-6">
          <h1 className="font-heading text-3xl font-bold">Products</h1>
          <Button onClick={openCreate} className="font-heading font-semibold">
            <Plus className="mr-2 h-4 w-4" /> Add Product
          </Button>
        </div>

        <Input placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} className="mb-6 max-w-sm" />

        <div className="rounded-lg border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left px-4 py-3 font-heading font-semibold text-xs uppercase tracking-wider text-muted-foreground">Product</th>
                  <th className="text-left px-4 py-3 font-heading font-semibold text-xs uppercase tracking-wider text-muted-foreground">Category</th>
                  <th className="text-left px-4 py-3 font-heading font-semibold text-xs uppercase tracking-wider text-muted-foreground">Price</th>
                  <th className="text-left px-4 py-3 font-heading font-semibold text-xs uppercase tracking-wider text-muted-foreground">Stock</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((product) => (
                  <tr key={product.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={product.image} alt={product.name} className="h-10 w-10 rounded object-cover bg-muted" />
                        <span className="font-heading font-semibold">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{product.category}</td>
                    <td className="px-4 py-3 font-heading font-semibold text-primary">{formatPrice(product.price)}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => toggleStock(product.id)} className={`text-xs px-2 py-0.5 rounded-full ${product.inStock ? 'bg-accent/20 text-accent' : 'bg-destructive/20 text-destructive'}`}>
                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(product)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create / Edit Dialog */}
        <Dialog open={isNew || !!editing} onOpenChange={() => { setEditing(null); setIsNew(false); }}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="font-heading">{isNew ? 'Create Product' : 'Edit Product'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input value={formName} onChange={(e) => setFormName(e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Price (₮)</Label>
                  <Input type="number" value={formPrice} onChange={(e) => setFormPrice(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Input value={formCategory} onChange={(e) => setFormCategory(e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Input value={formDesc} onChange={(e) => setFormDesc(e.target.value)} />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={formInStock} onChange={(e) => setFormInStock(e.target.checked)} id="inStock" className="rounded" />
                <Label htmlFor="inStock">In Stock</Label>
              </div>
              <Button onClick={handleSave} className="w-full font-heading font-semibold">
                {isNew ? 'Create Product' : 'Save Changes'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default AdminProducts;
