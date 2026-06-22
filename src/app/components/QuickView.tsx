import { X, Star, Heart, ShoppingBag, Shield, Truck } from "lucide-react";
import { formatCurrency } from "../utils";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import type { Product } from "./ProductCard";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface QuickViewProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (p: Product) => void;
}

export function QuickView({ product, onClose, onAddToCart }: QuickViewProps) {
  const [wishlisted, setWishlisted] = useState(false);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!product) return;
    const syncWishlistState = () => {
      const saved = localStorage.getItem("rosella_wishlist");
      if (!saved) {
        setWishlisted(false);
        return;
      }
      try {
        const list = JSON.parse(saved);
        setWishlisted(list.some((item: any) => item.id === product.id));
      } catch (e) {
        setWishlisted(false);
      }
    };
    syncWishlistState();
    window.addEventListener("rosella_wishlist_changed", syncWishlistState);
    window.addEventListener("storage", syncWishlistState);
    setQty(1);
    return () => {
      window.removeEventListener("rosella_wishlist_changed", syncWishlistState);
      window.removeEventListener("storage", syncWishlistState);
    };
  }, [product]);

  const handleAdd = () => {
    if (!product) return;
    for (let i = 0; i < qty; i++) {
      onAddToCart(product);
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const handleToggleWishlist = () => {
    if (!product) return;
    const saved = localStorage.getItem("rosella_wishlist");
    let list: Product[] = [];
    if (saved) {
      try {
        list = JSON.parse(saved);
      } catch (err) {}
    }
    const exists = list.some((item) => item.id === product.id);
    let updated;
    if (exists) {
      updated = list.filter((item) => item.id !== product.id);
      setWishlisted(false);
    } else {
      updated = [...list, product];
      setWishlisted(true);
    }
    localStorage.setItem("rosella_wishlist", JSON.stringify(updated));
    window.dispatchEvent(new Event("rosella_wishlist_changed"));
  };

  const discount = product ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4"
          style={{ background: "rgba(43,43,43,0.5)", backdropFilter: "blur(6px)" }}
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-3xl rounded-t-3xl sm:rounded-3xl overflow-hidden"
            style={{ background: "#0F0D04", maxHeight: "90vh", overflowY: "auto", border: "1px solid rgba(201,168,76,0.2)" }}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full flex items-center justify-center"
              style={{ background: "rgba(201,168,76,0.08)" }}
            >
              <X size={18} />
            </button>

            <div className="grid sm:grid-cols-2">
              {/* Image */}
              <div className="aspect-square sm:aspect-auto sm:h-full" style={{ background: "#080600", minHeight: "280px" }}>
                <ImageWithFallback src={product.image} alt={product.name} className="w-full h-full object-cover" />
              </div>

              {/* Details */}
              <div className="p-6 md:p-8 flex flex-col gap-4">
                <div>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.7rem", letterSpacing: "0.15em", color: "var(--rose-gold)", textTransform: "uppercase", fontWeight: 500 }}>
                    {product.category}
                  </p>
                  <h2 className="mt-1" style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", fontWeight: 600, color: "var(--foreground)", lineHeight: 1.2 }}>
                    {product.name}
                  </h2>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={13} fill={i < Math.floor(product.rating) ? "#C9A84C" : "none"} stroke={i < Math.floor(product.rating) ? "#C9A84C" : "#E0C87A"} />
                    ))}
                  </div>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.8rem", color: "var(--muted-foreground)" }}>
                    {product.rating} ({product.reviewCount} reviews)
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-3">
                  <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", fontWeight: 700, color: "var(--rose-gold)" }}>
                    {formatCurrency(product.price)}
                  </span>
                  {discount > 0 && (
                    <>
                      <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "1rem", color: "var(--muted-foreground)", textDecoration: "line-through" }}>
                        {formatCurrency(product.originalPrice)}
                      </span>
                      <span
                        className="px-2.5 py-1 rounded-full text-white"
                        style={{ background: "var(--rose-gold)", fontFamily: "'DM Sans', sans-serif", fontSize: "0.72rem", fontWeight: 600 }}
                      >
                        {discount}% OFF
                      </span>
                    </>
                  )}
                </div>

                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.875rem", color: "var(--muted-foreground)", lineHeight: 1.65, fontWeight: 300 }}>
                  Handcrafted with premium quality materials. Tarnish-resistant finish with a luxurious rose gold coating. Perfect for daily wear and special occasions.
                </p>

                {/* Qty */}
                <div className="flex items-center gap-3">
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.85rem", color: "var(--foreground)", fontWeight: 500 }}>Qty:</span>
                  <div className="flex items-center rounded-full overflow-hidden" style={{ border: "1.5px solid rgba(201,168,76,0.25)" }}>
                    <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="w-9 h-9 flex items-center justify-center transition-colors hover:bg-secondary" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "1.1rem", color: "var(--foreground)", background: "none", border: "none", cursor: "pointer" }}>−</button>
                    <span className="w-10 text-center" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.9rem", color: "var(--foreground)" }}>{qty}</span>
                    <button onClick={() => setQty((q) => q + 1)} className="w-9 h-9 flex items-center justify-center transition-colors hover:bg-secondary" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "1.1rem", color: "var(--foreground)", background: "none", border: "none", cursor: "pointer" }}>+</button>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={handleAdd}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-full text-white transition-all duration-300"
                    style={{
                      background: added ? "#2b2b2b" : "var(--primary-cta-background)",
                      color: added ? "var(--foreground)" : "var(--primary-foreground)",
                      fontFamily: "'DM Sans', sans-serif",
                      fontWeight: 500,
                      fontSize: "0.9rem",
                      letterSpacing: "0.05em",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    <ShoppingBag size={16} />
                    {added ? "Added to Cart!" : "Add to Cart"}
                  </button>
                  <button
                    onClick={handleToggleWishlist}
                    className="w-12 h-12 rounded-full flex items-center justify-center transition-all"
                    style={{ border: "1.5px solid rgba(201,168,76,0.3)", background: wishlisted ? "var(--rose-gold)" : "rgba(255,255,255,0.05)", cursor: "pointer" }}
                  >
                    <Heart size={18} fill={wishlisted ? "#000" : "none"} stroke={wishlisted ? "#000" : "var(--rose-gold)"} />
                  </button>
                </div>

                {/* Trust icons */}
                <div className="flex items-center gap-6 pt-2 border-t" style={{ borderColor: "rgba(201,168,76,0.12)" }}>
                  <div className="flex items-center gap-1.5">
                    <Shield size={14} style={{ color: "var(--rose-gold)" }} />
                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.72rem", color: "var(--muted-foreground)" }}>Authentic</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Truck size={14} style={{ color: "var(--rose-gold)" }} />
                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.72rem", color: "var(--muted-foreground)" }}>Free Shipping</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
