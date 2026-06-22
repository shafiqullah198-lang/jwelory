import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation, Navigate, useNavigate } from "react-router";
import { Header } from "./components/Header";
import { Footer } from "./components/Sections";
import { QuickView } from "./components/QuickView";
import { CartDrawer } from "./components/CartDrawer";
import type { Product } from "./components/ProductCard";

// Wishlist
import WishlistPage from "./pages/Wishlist";
import { WishlistDrawer } from "./components/WishlistDrawer";

// Authentication
import { AuthProvider, useAuth } from "./components/AuthContext";
import { AdminErrorBoundary } from "./components/AdminErrorBoundary";

// Pages
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import CartPage from "./pages/CartPage";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import OrderHistory from "./pages/OrderHistory";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import InfoPage from "./pages/InfoPage";

import { apiFetch } from "./api";
import { BRAND_NAME } from "./components/BrandLogo";

interface CartItem extends Product {
  qty: number;
  item_id: number; // reference to Django CartItem DB id
}

export function AppContent() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartSummary, setCartSummary] = useState({ subtotal: 0, total: 0 });
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const fetchCart = async () => {
    try {
      const data = await apiFetch("cart/");
      if (data && data.items) {
        const mapped = data.items.map((i: any) => ({
          id: i.product_id, // map product_id to id for Product shape
          item_id: i.id, // Django CartItem primary key
          name: i.name,
          slug: i.slug,
          category: i.category,
          price: i.price,
          originalPrice: i.price,
          rating: 5,
          reviewCount: 0,
          image: i.image,
          qty: i.quantity,
          stock: i.stock,
        }));
        setCartItems(mapped);
        setCartSummary({ subtotal: data.subtotal, total: data.total });
      }
    } catch (err) {
      console.error("Failed to load cart details from backend:", err);
    }
  };

  useEffect(() => {
    fetchCart();

    const syncWishlist = () => {
      const saved = localStorage.getItem("rosella_wishlist");
      if (!saved) {
        setWishlistItems([]);
        return;
      }
      try {
        setWishlistItems(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse wishlist:", e);
        setWishlistItems([]);
      }
    };

    syncWishlist();
    window.addEventListener("rosella_wishlist_changed", syncWishlist);
    window.addEventListener("storage", syncWishlist);
    return () => {
      window.removeEventListener("rosella_wishlist_changed", syncWishlist);
      window.removeEventListener("storage", syncWishlist);
    };
  }, []);

  const handleAddToCart = async (product: Product) => {
    try {
      const data = await apiFetch("cart/add/", {
        method: "POST",
        body: JSON.stringify({ product_id: product.id, quantity: 1 }),
      });
      if (data && data.success) {
        await fetchCart();
        setCartOpen(true);
      }
    } catch (err: any) {
      alert(err.message || "Failed to add item to cart.");
    }
  };

  const handleRemoveFromCart = async (id: number) => {
    const item = cartItems.find((i) => i.id === id);
    if (!item) return;
    try {
      const data = await apiFetch("cart/remove/", {
        method: "POST",
        body: JSON.stringify({ item_id: item.item_id }),
      });
      if (data && data.success) {
        await fetchCart();
      }
    } catch (err) {
      console.error("Failed to remove item from cart:", err);
    }
  };

  const handleUpdateCartQty = async (id: number, newQty: number) => {
    const item = cartItems.find((i) => i.id === id);
    if (!item) return;

    if (newQty <= 0) {
      await handleRemoveFromCart(id);
      return;
    }

    try {
      const data = await apiFetch("cart/update/", {
        method: "POST",
        body: JSON.stringify({ item_id: item.item_id, quantity: newQty }),
      });
      if (data && data.success) {
        await fetchCart();
      }
    } catch (err) {
      console.error("Failed to update cart quantity:", err);
    }
  };

  const handleToggleWishlist = (product: Product) => {
    setWishlistItems((prev) => {
      const exists = prev.some((item) => item.id === product.id);
      let updated;
      if (exists) {
        updated = prev.filter((item) => item.id !== product.id);
      } else {
        updated = [...prev, product];
      }
      localStorage.setItem("rosella_wishlist", JSON.stringify(updated));
      window.dispatchEvent(new Event("rosella_wishlist_changed"));
      return updated;
    });
  };

  const cartCount = cartItems.reduce((sum, i) => sum + i.qty, 0);

  const drawerItems = cartItems.map((item) => ({
    ...item,
    id: item.id,
  }));

  const location = useLocation();
  const isAdmin =
    location.pathname.startsWith("/admin") || location.pathname.startsWith("/dashboard");

  useEffect(() => {
    if (location.pathname.startsWith("/dashboard") || location.pathname.startsWith("/admin")) {
      document.title = `${BRAND_NAME} Admin`;
      return;
    }

    if (location.pathname === "/login") {
      document.title = `Login | ${BRAND_NAME}`;
      return;
    }

    if (location.pathname === "/signup") {
      document.title = `Sign Up | ${BRAND_NAME}`;
      return;
    }

    document.title = BRAND_NAME;
  }, [location.pathname]);

  // Hash-based smooth scroll helper
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 300);
    }
  }, [location]);

  return (
    <div
      id="app-shell"
      style={{
        fontFamily: "'DM Sans', sans-serif",
        background: "var(--background)",
        minHeight: "100vh",
        overflowX: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {!isAdmin && (
        <Header
          cartCount={cartCount}
          wishlistCount={wishlistItems.length}
          onCartClick={() => setCartOpen(true)}
          onWishlistClick={() => setWishlistOpen(true)}
        />
      )}

      <div id="page-content" className="flex-grow">
        <Routes>
          <Route
            path="/"
            element={<Home onAddToCart={handleAddToCart} onQuickView={setQuickViewProduct} />}
          />
          <Route
            path="/products"
            element={<Products onAddToCart={handleAddToCart} onQuickView={setQuickViewProduct} />}
          />
          <Route
            path="/products/:slug"
            element={<ProductDetail onAddToCart={handleAddToCart} onQuickView={setQuickViewProduct} />}
          />
          <Route
            path="/collections"
            element={<Products onAddToCart={handleAddToCart} onQuickView={setQuickViewProduct} />}
          />
          <Route
            path="/collections/:slug"
            element={<Products onAddToCart={handleAddToCart} onQuickView={setQuickViewProduct} />}
          />
          <Route
            path="/new-arrivals"
            element={<Products onAddToCart={handleAddToCart} onQuickView={setQuickViewProduct} />}
          />
          <Route
            path="/best-sellers"
            element={<Products onAddToCart={handleAddToCart} onQuickView={setQuickViewProduct} />}
          />
          <Route
            path="/sale"
            element={<Products onAddToCart={handleAddToCart} onQuickView={setQuickViewProduct} />}
          />
          {/* Info / static pages */}
          {[
            "/about", "/our-story", "/careers", "/press", "/sustainability",
            "/shipping-info", "/returns", "/size-guide", "/care-instructions", "/faq",
            "/privacy-policy", "/terms-of-service", "/cookie-policy",
          ].map((path) => (
            <Route key={path} path={path} element={<InfoPage />} />
          ))}
          <Route
            path="/wishlist"
            element={
              <WishlistPage
                items={wishlistItems}
                onRemove={handleToggleWishlist}
                onAddToCart={handleAddToCart}
              />
            }
          />
          <Route
            path="/cart"
            element={
              <CartPage
                items={cartItems}
                subtotal={cartSummary.subtotal}
                total={cartSummary.total}
                onRemove={handleRemoveFromCart}
                onUpdateQty={handleUpdateCartQty}
              />
            }
          />
          <Route
            path="/checkout"
            element={<Checkout onOrderSuccess={fetchCart} />}
          />
          <Route path="/order-success/:order_number" element={<OrderSuccess />} />
          <Route path="/orders" element={<OrderHistory />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<Profile />} />
          
          {/* Admin routes */}
          <Route
            path="/admin"
            element={
              <AdminErrorBoundary>
                <AdminRedirect />
              </AdminErrorBoundary>
            }
          />
          <Route
            path="/admin/login"
            element={
              <AdminErrorBoundary>
                <AdminLogin />
              </AdminErrorBoundary>
            }
          />
          <Route
            path="/dashboard"
            element={
              <AdminGuard>
                <AdminErrorBoundary>
                  <AdminDashboard />
                </AdminErrorBoundary>
              </AdminGuard>
            }
          />
          <Route path="/admin/dashboard" element={<Navigate to="/dashboard" replace />} />
          {["dashboard", "products", "categories", "orders", "customers", "reviews", "hero-banners", "cms", "settings"].map((path) => (
            <Route
              key={path}
              path={`/admin/${path}`}
              element={
                <AdminGuard>
                  <AdminErrorBoundary>
                    <AdminDashboard />
                  </AdminErrorBoundary>
                </AdminGuard>
              }
            />
          ))}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      {!isAdmin && <Footer />}

      <QuickView
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
      />

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        items={drawerItems}
        onRemove={handleRemoveFromCart}
        onUpdateQty={handleUpdateCartQty}
      />

      <WishlistDrawer
        open={wishlistOpen}
        onClose={() => setWishlistOpen(false)}
        items={wishlistItems}
        onRemove={handleToggleWishlist}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
}

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function verify() {
      if (loading) return;
      if (!user) {
        navigate("/admin/login", { replace: true });
      } else if (!user.is_staff) {
        await logout();
        navigate("/admin/login?error=not_admin", { replace: true });
      } else {
        setChecking(false);
      }
    }
    verify();
  }, [user, loading, navigate, logout]);

  if (loading || checking) {
    return (
      <div className="min-h-screen bg-[#060400] flex items-center justify-center text-[#C9A84C]">
        <div className="animate-pulse">Verifying credentials...</div>
      </div>
    );
  }

  return <>{children}</>;
}

export function AdminRedirect() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    async function check() {
      if (loading) return;
      if (user) {
        if (user.is_staff) {
          navigate("/dashboard", { replace: true });
        } else {
          await logout();
          navigate("/admin/login?error=not_admin", { replace: true });
        }
      } else {
        navigate("/admin/login", { replace: true });
      }
    }
    check();
  }, [user, loading, navigate, logout]);

  return (
    <div className="min-h-screen bg-[#060400] flex items-center justify-center text-[#C9A84C]">
      <div className="animate-pulse">Redirecting...</div>
    </div>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}
