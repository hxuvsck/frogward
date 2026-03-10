import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/auth-store";
import Index from "./pages/Index";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import VerifyOtp from "./pages/VerifyOtp";
import Account from "./pages/Account";
import AccountOrders from "./pages/AccountOrders";
import AccountProfile from "./pages/AccountProfile";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminOrderProfile from "./pages/admin/AdminOrderProfile";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminProductProfile from "./pages/admin/AdminProductProfile";
import AdminCustomers from "./pages/admin/AdminCustomers";
import AdminCustomerProfile from "./pages/admin/AdminCustomerProfile";
import AdminMarketing from "./pages/admin/AdminMarketing";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import StoryDetail from "./pages/StoryDetail";

const queryClient = new QueryClient();
const ADMIN_SESSION_TIMEOUT_MS = 15 * 60 * 1000;
const ADMIN_ACTIVITY_KEY = "frogward-admin-last-activity";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);

  return null;
};

const AdminSessionManager = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const isAdmin = isAuthenticated && user?.role === "admin";

  useEffect(() => {
    if (!isAdmin) {
      window.localStorage.removeItem(ADMIN_ACTIVITY_KEY);
      return;
    }

    const updateActivity = () => {
      window.localStorage.setItem(ADMIN_ACTIVITY_KEY, String(Date.now()));
    };

    const checkTimeout = () => {
      const lastActivity = Number(window.localStorage.getItem(ADMIN_ACTIVITY_KEY) || Date.now());
      if (Date.now() - lastActivity >= ADMIN_SESSION_TIMEOUT_MS) {
        logout();
        window.localStorage.removeItem(ADMIN_ACTIVITY_KEY);
        navigate("/login", { replace: true });
      }
    };

    updateActivity();

    const events: Array<keyof WindowEventMap> = [
      "mousedown",
      "keydown",
      "touchstart",
      "scroll",
      "mousemove",
    ];

    events.forEach((event) => window.addEventListener(event, updateActivity, { passive: true }));
    const intervalId = window.setInterval(checkTimeout, 30_000);
    checkTimeout();

    return () => {
      events.forEach((event) => window.removeEventListener(event, updateActivity));
      window.clearInterval(intervalId);
    };
  }, [isAdmin, logout, navigate]);

  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <AdminSessionManager />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:slug" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/login" element={<Login />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/stories/:slug" element={<StoryDetail />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/account" element={<Account />} />
          <Route path="/account/orders" element={<AccountOrders />} />
          <Route path="/account/profile" element={<AccountProfile />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/admin/orders/:id" element={<AdminOrderProfile />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/products/:id" element={<AdminProductProfile />} />
          <Route path="/admin/marketing" element={<AdminMarketing />} />
          <Route path="/admin/customers" element={<AdminCustomers />} />
          <Route path="/admin/customers/:id" element={<AdminCustomerProfile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
