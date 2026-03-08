import { useState } from 'react';
import { Navigate, Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Plus, Pencil, Trash2, Eye, Package, ShoppingCart } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/store/auth-store';
import { useOrderStore } from '@/store/order-store';
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
  const orders = useOrderStore((s) => s.orders);
  const [searchParams, setSearchParams] = useSearchParams();

  const [productList, setProductList] = useState<Product[]>(initialProducts);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<Product | null>(null);
  const [viewing, setViewing] = useState<Product | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [formName, setFormName] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formCategory, setFormCategory] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formInStock, setFormInStock] = useState(true);

  if (!isAuthenticated || !user || user.role !== 'admin') return <Navigate to="/login" replace />;

  // Auto-open product detail from URL param (cross-link from orders)
  const highlightId = searchParams.get('view');
  if (highlightId && !viewing) {
    const found = productList.find((p) => p.id === highlightId);
    if (found) {
      setTimeout(() => setViewing(found), 0);
      searchParams.delete('view');
      setSearchParams(searchParams, { replace: true });
    }
  }

  const filtered = productList.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
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

  const handleDelete = (id: string) => {
    setProductList((prev) => prev.filter((p) => p.id !== id));
    toast({ title: 'Product deleted' });
  };

  const toggleStock = (id: string) => {
    setProductList((prev) => prev.map((p) => p.id === id ? { ...p, inStock: !p.inStock } : p));
  };

  // Get orders containing a specific product
  const getProductOrders = (productId: string) =>
    orders.filter((o) => o.items.some((i) => i.productId === productId));

  const totalSold = (productId: string) =>
    orders
      .flatMap((o) => o.items)
      .filter((i) => i.productId === productId)
      .reduce((sum, i) => sum + i.quantity, 0);

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

        <Input placeholder="Search by name or category..." value={search} onChange={(e) => setSearch(e.target.value)} className="mb-6 max-w-sm" />

        <div className="rounded-lg border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left px-4 py-3 font-heading font-semibold text-xs uppercase tracking-wider text-muted-foreground">Product</th>
                  <th className="text-left px-4 py-3 font-heading font-semibold text-xs uppercase tracking-wider text-muted-foreground">Category</th>
                  <th className="text-left px-4 py-3 font-heading font-semibold text-xs uppercase tracking-wider text-muted-foreground">Price</th>
                  <th className="text-left px-4 py-3 font-heading font-semibold text-xs uppercase tracking-wider text-muted-foreground">Sold</th>
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
                    <td className="px-4 py-3 text-muted-foreground capitalize">{product.category}</td>
                    <td className="px-4 py-3 font-heading font-semibold text-primary">{formatPrice(product.price)}</td>
                    <td className="px-4 py-3 text-muted-foreground">{totalSold(product.id)}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => toggleStock(product.id)} className={`text-xs px-2 py-0.5 rounded-full ${product.inStock ? 'bg-accent/20 text-accent' : 'bg-destructive/20 text-destructive'}`}>
                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => setViewing(product)}><Eye className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => openEdit(product)}><Pencil className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(product.id)} className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && <p className="text-center text-muted-foreground py-8">No products found.</p>}
        </div>

        {/* Product Detail Dialog */}
        <Dialog open={!!viewing} onOpenChange={() => setViewing(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="font-heading flex items-center gap-2"><Package className="h-5 w-5 text-primary" /> {viewing?.name}</DialogTitle>
            </DialogHeader>
            {viewing && (
              <div className="space-y-5">
                <div className="flex gap-4">
                  <img src={viewing.image} alt={viewing.name} className="h-24 w-24 rounded-lg object-cover bg-muted" />
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground capitalize">{viewing.category}</p>
                    <p className="font-heading font-bold text-primary text-xl">{formatPrice(viewing.price)}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${viewing.inStock ? 'bg-accent/20 text-accent' : 'bg-destructive/20 text-destructive'}`}>
                      {viewing.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{viewing.description}</p>

                {viewing.specs && (
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-heading font-semibold">Specifications</p>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                      {Object.entries(viewing.specs).map(([k, v]) => (
                        <div key={k}><span className="text-muted-foreground">{k}:</span> {v}</div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-heading font-semibold flex items-center gap-1">
                    <ShoppingCart className="h-3 w-3" /> Orders containing this product ({getProductOrders(viewing.id).length})
                  </p>
                  {getProductOrders(viewing.id).length === 0 ? (
                    <p className="text-sm text-muted-foreground">No orders yet.</p>
                  ) : (
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {getProductOrders(viewing.id).map((order) => (
                        <Link
                          key={order.id}
                          to={`/admin/orders?view=${order.id}`}
                          onClick={() => setViewing(null)}
                          className="flex items-center justify-between rounded-md border border-border p-2 hover:border-primary/30 transition-all text-sm"
                        >
                          <div>
                            <span className="font-heading font-semibold">{order.id}</span>
                            <span className="text-muted-foreground ml-2">{order.customerName}</span>
                          </div>
                          <span className="text-primary font-heading font-semibold">{formatPrice(order.totalAmount)}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button onClick={() => { openEdit(viewing); setViewing(null); }} variant="outline" className="flex-1 font-heading font-semibold">
                    <Pencil className="mr-2 h-4 w-4" /> Edit
                  </Button>
                  <Button onClick={() => { handleDelete(viewing.id); setViewing(null); }} variant="outline" className="text-destructive hover:text-destructive font-heading font-semibold">
                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Create/Edit Dialog */}
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
