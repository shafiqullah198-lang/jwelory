import { useState } from "react";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import {
  FeaturedCategories,
  BestSellers,
  NewArrivals,
  OfferBanner,
  WhyChooseUs,
  Testimonials,
  InstagramGallery,
  Newsletter,
  Footer,
} from "./components/Sections";
import { ProductGrid } from "./components/ProductGrid";
import { QuickView } from "./components/QuickView";
import { CartDrawer } from "./components/CartDrawer";
import type { Product } from "./components/ProductCard";

/* MARKER-MAKE-KIT-INVOKED */

interface CartItem extends Product {
  qty: number;
}

export default function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const handleAddToCart = (product: Product) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) return prev.map((i) => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const handleRemoveFromCart = (id: number) => {
    setCartItems((prev) => prev.filter((i) => i.id !== id));
  };

  const cartCount = cartItems.reduce((sum, i) => sum + i.qty, 0);

  return (
    <div
      style={{
        fontFamily: "'DM Sans', sans-serif",
        background: "var(--background)",
        minHeight: "100vh",
        overflowX: "hidden",
      }}
    >
      <Header
        cartCount={cartCount}
        wishlistCount={2}
        onCartClick={() => setCartOpen(true)}
      />

      <main>
        <Hero />
        <FeaturedCategories />
        <BestSellers onAddToCart={handleAddToCart} onQuickView={setQuickViewProduct} />
        <NewArrivals onAddToCart={handleAddToCart} onQuickView={setQuickViewProduct} />
        <OfferBanner />
        <ProductGrid onAddToCart={handleAddToCart} onQuickView={setQuickViewProduct} />
        <WhyChooseUs />
        <Testimonials />
        <InstagramGallery />
        <Newsletter />
      </main>

      <Footer />

      <QuickView
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
      />

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems}
        onRemove={handleRemoveFromCart}
      />
    </div>
  );
}
