import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Lang = 'mn' | 'en';

const translations = {
  // Navbar
  'nav.products': { mn: 'Бүтээгдэхүүн', en: 'Products' },
  'nav.about': { mn: 'Бидний тухай', en: 'About Us' },
  'nav.cart': { mn: 'Сагс', en: 'Cart' },
  'nav.signIn': { mn: 'Нэвтрэх', en: 'Sign In' },
  'nav.admin': { mn: 'Админ', en: 'Admin' },
  'nav.search': { mn: 'Бүтээгдэхүүн хайх...', en: 'Search products...' },
  'nav.logout': { mn: 'Гарах', en: 'Log Out' },

  // Hero / Index
  'hero.badge': { mn: 'Үйлдвэрийн зэрэглэлийн тоног төхөөрөмж', en: 'Industrial Grade Equipment' },
  'hero.title1': { mn: 'Хамгийн ', en: 'Built for the ' },
  'hero.titleHighlight': { mn: 'хатуу', en: 'toughest' },
  'hero.title2': { mn: ' нөхцөлд зориулсан', en: ' conditions' },
  'hero.desc': { mn: 'Монголын үйлдвэрүүдэд итгэмжлэгдсэн мэргэжлийн ажлын хувцас болон хамгаалах хэрэгсэл.', en: 'Professional workwear and PPE equipment trusted by industries across Mongolia.' },
  'hero.shopNow': { mn: 'Дэлгүүр үзэх', en: 'Shop Now' },
  'hero.certifiedSafety': { mn: 'Баталгаат аюулгүй байдал', en: 'Certified Safety' },
  'hero.certifiedSafetyDesc': { mn: 'Бүх бүтээгдэхүүн олон улсын аюулгүй байдлын стандартад нийцнэ', en: 'All products meet international safety standards' },
  'hero.fastDelivery': { mn: 'Хурдан хүргэлт', en: 'Fast Delivery' },
  'hero.fastDeliveryDesc': { mn: 'Улаанбаатарт тухайн өдрийн хүргэлт', en: 'Same-day delivery in Ulaanbaatar' },
  'hero.support': { mn: '24/7 Тусламж', en: '24/7 Support' },
  'hero.supportDesc': { mn: 'Тоног төхөөрөмж сонгоход мэргэжилтний зөвлөгөө', en: 'Expert support for equipment selection' },
  'hero.shopByCategory': { mn: 'Ангиллаар хайх', en: 'Shop by Category' },
  'hero.featured': { mn: 'Онцлох бүтээгдэхүүн', en: 'Featured Products' },
  'hero.viewAll': { mn: 'Бүгдийг үзэх', en: 'View All' },

  // Categories
  'cat.helmets': { mn: 'Аюулгүйн малгай', en: 'Safety Helmets' },
  'cat.vests': { mn: 'Тусгаг хантааз', en: 'Hi-Vis Vests' },
  'cat.gloves': { mn: 'Ажлын бээлий', en: 'Work Gloves' },
  'cat.boots': { mn: 'Аюулгүйн гутал', en: 'Safety Boots' },
  'cat.eyewear': { mn: 'Нүдний хамгаалалт', en: 'Eye Protection' },
  'cat.coveralls': { mn: 'Комбинезон', en: 'Coveralls' },

  // Product Card
  'product.inStock': { mn: 'Байгаа', en: 'In Stock' },
  'product.outOfStock': { mn: 'Дууссан', en: 'Out of Stock' },
  'product.addToCart': { mn: 'Сагсанд нэмэх', en: 'Add to Cart' },
  'product.inCart': { mn: 'Сагсанд байна', en: 'In Cart' },
  'product.items': { mn: 'бүтээгдэхүүн', en: 'items' },

  // Products page
  'products.title': { mn: 'Бүх бүтээгдэхүүн', en: 'All Products' },
  'products.all': { mn: 'Бүгд', en: 'All' },
  'products.default': { mn: 'Анхдагч', en: 'Default' },
  'products.priceAsc': { mn: 'Үнэ: Бага → Их', en: 'Price: Low → High' },
  'products.priceDesc': { mn: 'Үнэ: Их → Бага', en: 'Price: High → Low' },
  'products.noResults': { mn: 'Бүтээгдэхүүн олдсонгүй.', en: 'No products found.' },

  // Cart
  'cart.title': { mn: 'Таны сагс', en: 'Your Cart' },
  'cart.empty': { mn: 'Таны сагс хоосон байна', en: 'Your cart is empty' },
  'cart.emptyDesc': { mn: 'Бүтээгдэхүүн үзэж сагсандаа нэмнэ үү.', en: 'Browse our products and add items to your cart.' },
  'cart.browse': { mn: 'Бүтээгдэхүүн үзэх', en: 'Browse Products' },
  'cart.orderSummary': { mn: 'Захиалгын хураангуй', en: 'Order Summary' },
  'cart.subtotal': { mn: 'Дүн', en: 'Subtotal' },
  'cart.shipping': { mn: 'Хүргэлт', en: 'Shipping' },
  'cart.free': { mn: 'Үнэгүй', en: 'Free' },
  'cart.total': { mn: 'Нийт', en: 'Total' },
  'cart.checkout': { mn: 'Төлбөр төлөх', en: 'Proceed to Checkout' },
  'cart.clear': { mn: 'Сагс хоослох', en: 'Clear Cart' },

  // Checkout
  'checkout.title': { mn: 'Захиалга', en: 'Checkout' },
  'checkout.backToCart': { mn: 'Сагс руу буцах', en: 'Back to Cart' },
  'checkout.customerInfo': { mn: 'Захиалагчийн мэдээлэл', en: 'Customer Information' },
  'checkout.fullName': { mn: 'Бүтэн нэр', en: 'Full Name' },
  'checkout.phone': { mn: 'Утас', en: 'Phone' },
  'checkout.email': { mn: 'Имэйл', en: 'Email' },
  'checkout.address': { mn: 'Хүргэлтийн хаяг', en: 'Delivery Address' },
  'checkout.orderSummary': { mn: 'Захиалгын хураангуй', en: 'Order Summary' },
  'checkout.paymentMethod': { mn: 'Төлбөрийн арга', en: 'Payment Method' },
  'checkout.placeOrder': { mn: 'Захиалга өгөх', en: 'Place Order' },
  'checkout.noItems': { mn: 'Захиалах бүтээгдэхүүн байхгүй', en: 'No items to checkout' },
  'checkout.success': { mn: 'Захиалга амжилттай!', en: 'Order Placed!' },
  'checkout.successDesc': { mn: 'Таны захиалга хүлээн авлаа. Төлбөрийн зааварчилгааг удахгүй илгээнэ.', en: 'Your order has been submitted. You will receive payment instructions shortly.' },
  'checkout.viewOrders': { mn: 'Миний захиалгууд', en: 'View My Orders' },
  'checkout.backHome': { mn: 'Нүүр хуудас', en: 'Back to Home' },

  // Login
  'login.title': { mn: 'Нэвтрэх', en: 'Sign in to' },
  'login.desc': { mn: 'Бүртгэл, захиалга болон бусад мэдээллээ хаанаас ч удирдана уу.', en: 'Access your account, orders, and more.' },
  'login.facebook': { mn: 'Facebook-ээр нэвтрэх', en: 'Continue with Facebook' },
  'login.or': { mn: 'эсвэл', en: 'or' },
  'login.phoneLabel': { mn: 'Утасны дугаар', en: 'Phone Number' },
  'login.phoneOtp': { mn: 'Утасны OTP-ээр нэвтрэх', en: 'Continue with Phone OTP' },

  // Verify OTP
  'otp.title': { mn: 'Утасаа баталгаажуулна уу', en: 'Verify Your Phone' },
  'otp.sent': { mn: '6 оронтой код илгээлээ', en: 'We sent a 6-digit code to' },
  'otp.verify': { mn: 'Баталгаажуулах', en: 'Verify Code' },
  'otp.resendIn': { mn: 'Дахин илгээх', en: 'Resend code in' },
  'otp.resend': { mn: 'Код дахин илгээх', en: 'Resend Code' },
  'otp.enterCode': { mn: '6 оронтой кодоо оруулна уу.', en: 'Please enter a 6-digit code.' },
  'otp.invalid': { mn: 'Буруу код. 123456 оруулна уу.', en: 'Invalid code. Try 123456.' },

  // Account
  'account.title': { mn: 'Миний бүртгэл', en: 'My Account' },
  'account.signOut': { mn: 'Гарах', en: 'Sign Out' },
  'account.deliveryAddress': { mn: 'Хүргэлтийн хаяг', en: 'Delivery Address' },
  'account.notSet': { mn: 'Тохируулаагүй', en: 'Not set' },
  'account.orders': { mn: 'Захиалгууд', en: 'Orders' },
  'account.recentOrders': { mn: 'сүүлийн захиалгууд', en: 'recent orders' },
  'account.editProfile': { mn: 'Профайл засах', en: 'Edit Profile' },
  'account.allOrders': { mn: 'Бүх захиалга', en: 'All Orders' },
  'account.recent': { mn: 'Сүүлийн захиалгууд', en: 'Recent Orders' },
  'account.noOrders': { mn: 'Захиалга байхгүй байна.', en: 'No orders yet.' },

  // About
  'about.title': { mn: 'Бидний тухай', en: 'About' },
  'about.desc': { mn: 'Монголын итгэмжлэгдсэн үйлдвэрийн ажлын хувцас болон хувийн хамгаалах хэрэгслийн эх сурвалж.', en: "Mongolia's trusted source for industrial workwear and personal protective equipment." },
  'about.safetyFirst': { mn: 'Аюулгүй байдал нэгдүгээрт', en: 'Safety First' },
  'about.safetyFirstDesc': { mn: 'Бүх бүтээгдэхүүн олон улсын аюулгүй байдлын стандартад нийцнэ — ANSI, NFPA, ASTM.', en: 'Every product meets international safety standards — ANSI, NFPA, ASTM certified gear you can rely on.' },
  'about.industrialGrade': { mn: 'Үйлдвэрийн зэрэглэл', en: 'Industrial Grade' },
  'about.industrialGradeDesc': { mn: 'Монголын уул уурхай, барилга, үйлдвэрлэлийн хатуу нөхцөлд зориулсан.', en: 'Built for mining, construction, manufacturing, and heavy industry environments across Mongolia.' },
  'about.b2b': { mn: 'B2B & B2C', en: 'B2B & B2C' },
  'about.b2bDesc': { mn: 'Хувь хүн болон байгууллагын бөөний захиалгыг ижил чанар, хурдаар үйлчилнэ.', en: 'We serve individual workers and bulk enterprise orders with the same quality and speed.' },
  'about.delivery': { mn: 'Улс даяарх хүргэлт', en: 'Nationwide Delivery' },
  'about.deliveryDesc': { mn: 'Улаанбаатарт хурдан хүргэлт, бүх аймагт найдвартай тээвэрлэлт.', en: 'Fast delivery to Ulaanbaatar and reliable shipping to all aimags across the country.' },
  'about.mission': { mn: 'Бидний зорилго', en: 'Our Mission' },
  'about.missionText1': { mn: 'FrogWard нь энгийн асуудлыг шийдэхийн тулд байгуулагдсан: Монголд чанартай аюулгүйн тоног төхөөрөмж олоход хэцүү байх ёсгүй. Бид баталгаажсан үйлдвэрлэгчдээс шууд авч, ажилчид болон бизнесүүдэд хүргэдэг.', en: "FrogWard was founded to solve a simple problem: getting high-quality safety equipment in Mongolia shouldn't be hard. We source directly from certified manufacturers and deliver industrial workwear, PPE, and safety equipment to workers and businesses who need reliable protection every day." },
  'about.missionText2': { mn: 'Эрдэнэтийн уурхайн баг, Дарханы барилгын баг, эсвэл Улаанбаатарт хувийн хамгаалах хэрэгсэл хэрэгтэй бол — FrogWard QPay болон StorePay-ээр хурдан төлбөр тооцоотой.', en: "Whether you're outfitting a mining crew in Erdenet, a construction team in Darkhan, or need personal safety gear in Ulaanbaatar — FrogWard has you covered with fast checkout via QPay and StorePay." },
  'about.contact': { mn: 'Асуулт байна уу? Бидэнтэй холбогдоорой', en: 'Questions? Reach us at' },

  // Footer
  'footer.desc': { mn: 'Үйлдвэрийн ажлын хувцас & аюулгүйн тоног төхөөрөмж. Хамгийн хатуу нөхцөлд зориулсан.', en: 'Industrial workwear & safety equipment. Built for the toughest conditions.' },
  'footer.shop': { mn: 'Дэлгүүр', en: 'Shop' },
  'footer.allProducts': { mn: 'Бүх бүтээгдэхүүн', en: 'All Products' },
  'footer.support': { mn: 'Тусламж', en: 'Support' },
  'footer.rights': { mn: '© 2026 FrogWard. Бүх эрх хуулиар хамгаалагдсан.', en: '© 2026 FrogWard. All rights reserved.' },

  // Theme
  'theme.light': { mn: 'Цайвар', en: 'Light' },
  'theme.dark': { mn: 'Бараан', en: 'Dark' },

  // Common
  'common.backToAccount': { mn: 'Бүртгэл рүү буцах', en: 'Back to Account' },
  'common.dashboard': { mn: 'Хянах самбар', en: 'Dashboard' },

  // Admin Dashboard
  'admin.dashboard': { mn: 'Админ хянах самбар', en: 'Admin Dashboard' },
  'admin.totalOrders': { mn: 'Нийт захиалга', en: 'Total Orders' },
  'admin.pendingPayment': { mn: 'Төлбөр хүлээгдэж буй', en: 'Pending Payment' },
  'admin.paidOrders': { mn: 'Төлсөн захиалга', en: 'Paid Orders' },
  'admin.products': { mn: 'Бүтээгдэхүүн', en: 'Products' },
  'admin.lowStock': { mn: 'Нөөц бага/Дууссан', en: 'Low/No Stock' },
  'admin.customers': { mn: 'Харилцагчид', en: 'Customers' },
  'admin.manageOrders': { mn: 'Захиалга удирдах', en: 'Manage Orders' },
  'admin.manageOrdersDesc': { mn: 'Захиалга харах, шүүх, төлөв шинэчлэх', en: 'View, filter, and update order statuses' },
  'admin.manageProducts': { mn: 'Бүтээгдэхүүн удирдах', en: 'Manage Products' },
  'admin.manageProductsDesc': { mn: 'Бүтээгдэхүүн үүсгэх, засах, нөөц удирдах', en: 'Create, edit, and manage inventory' },
  'admin.customersDesc': { mn: 'Харилцагчдын жагсаалт, идэвх харах', en: 'View customer list and activity' },

  // Admin Orders
  'admin.orders': { mn: 'Захиалгууд', en: 'Orders' },
  'admin.searchOrders': { mn: 'ID эсвэл харилцагчаар хайх...', en: 'Search by ID or customer...' },
  'admin.all': { mn: 'Бүгд', en: 'All' },
  'admin.order': { mn: 'Захиалга', en: 'Order' },
  'admin.customer': { mn: 'Харилцагч', en: 'Customer' },
  'admin.total': { mn: 'Нийт', en: 'Total' },
  'admin.payment': { mn: 'Төлбөр', en: 'Payment' },
  'admin.status': { mn: 'Төлөв', en: 'Status' },
  'admin.date': { mn: 'Огноо', en: 'Date' },
  'admin.noOrders': { mn: 'Захиалга олдсонгүй.', en: 'No orders found.' },
  'admin.phone': { mn: 'Утас', en: 'Phone' },
  'admin.address': { mn: 'Хаяг', en: 'Address' },
  'admin.created': { mn: 'Үүсгэсэн', en: 'Created' },
  'admin.updateStatus': { mn: 'Төлөв шинэчлэх', en: 'Update Status' },

  // Admin Products
  'admin.addProduct': { mn: 'Бүтээгдэхүүн нэмэх', en: 'Add Product' },
  'admin.searchProducts': { mn: 'Нэр эсвэл ангиллаар хайх...', en: 'Search by name or category...' },
  'admin.product': { mn: 'Бүтээгдэхүүн', en: 'Product' },
  'admin.category': { mn: 'Ангилал', en: 'Category' },
  'admin.price': { mn: 'Үнэ', en: 'Price' },
  'admin.sold': { mn: 'Зарагдсан', en: 'Sold' },
  'admin.stock': { mn: 'Нөөц', en: 'Stock' },
  'admin.inStock': { mn: 'Байгаа', en: 'In Stock' },
  'admin.outOfStock': { mn: 'Дууссан', en: 'Out of Stock' },
  'admin.noProducts': { mn: 'Бүтээгдэхүүн олдсонгүй.', en: 'No products found.' },
  'admin.specifications': { mn: 'Техникийн үзүүлэлт', en: 'Specifications' },
  'admin.ordersContaining': { mn: 'Энэ бүтээгдэхүүнтэй захиалга', en: 'Orders containing this product' },
  'admin.noOrdersYet': { mn: 'Захиалга байхгүй.', en: 'No orders yet.' },
  'admin.edit': { mn: 'Засах', en: 'Edit' },
  'admin.delete': { mn: 'Устгах', en: 'Delete' },
  'admin.createProduct': { mn: 'Бүтээгдэхүүн үүсгэх', en: 'Create Product' },
  'admin.editProduct': { mn: 'Бүтээгдэхүүн засах', en: 'Edit Product' },
  'admin.name': { mn: 'Нэр', en: 'Name' },
  'admin.description': { mn: 'Тайлбар', en: 'Description' },
  'admin.saveChanges': { mn: 'Хадгалах', en: 'Save Changes' },
  'admin.productCreated': { mn: 'Бүтээгдэхүүн үүсгэгдлээ', en: 'Product created' },
  'admin.productUpdated': { mn: 'Бүтээгдэхүүн шинэчлэгдлээ', en: 'Product updated' },
  'admin.productDeleted': { mn: 'Бүтээгдэхүүн устгагдлаа', en: 'Product deleted' },

  // Admin Customers
  'admin.searchCustomers': { mn: 'Нэр, утас, имэйлээр хайх...', en: 'Search by name, phone, or email...' },
  'admin.email': { mn: 'Имэйл', en: 'Email' },
  'admin.ordersCount': { mn: 'Захиалга', en: 'Orders' },
  'admin.totalSpent': { mn: 'Нийт зарцуулсан', en: 'Total Spent' },
  'admin.lastActive': { mn: 'Сүүлд идэвхтэй', en: 'Last Active' },
  'admin.noCustomers': { mn: 'Харилцагч олдсонгүй.', en: 'No customers found.' },
  'admin.orderHistory': { mn: 'Захиалгын түүх', en: 'Order History' },
  'admin.productsPurchased': { mn: 'Худалдан авсан бүтээгдэхүүн', en: 'Products Purchased' },
  'admin.exportCsv': { mn: 'CSV татах', en: 'Export CSV' },
} as const;

export type TranslationKey = keyof typeof translations;

interface LangStore {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: TranslationKey) => string;
}

export const useLangStore = create<LangStore>()(
  persist(
    (set, get) => ({
      lang: 'mn',
      setLang: (lang) => set({ lang }),
      t: (key) => {
        const entry = translations[key];
        return entry ? entry[get().lang] : key;
      },
    }),
    { name: 'frogward-lang' }
  )
);

// Hook shortcut
export const useT = () => useLangStore((s) => s.t);
