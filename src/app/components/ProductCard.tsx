import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { Heart, ShoppingBag, Star, Eye, Zap } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { formatCurrency } from "../utils";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewCount: number;
  image: string;
  badge?: string;
  isNew?: boolean;
  isTrending?: boolean;
  slug?: string;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onQuickView: (product: Product) => void;
}

const GOLD = "#C9A84C";

function ProductCardComponent({ product, onAddToCart, onQuickView }: ProductCardProps) {
  const [wishlisted, setWishlisted] = useState(() => {
    const saved = localStorage.getItem("rosella_wishlist");
    if (saved) {
      try {
        const list = JSON.parse(saved);
        return list.some((item: any) => item.id === product.id);
      } catch (e) {
        return false;
      }
    }
    return false;
  });
  const [addedToCart, setAddedToCart] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const syncWishlistState = () => {
      try {
        const list = JSON.parse(localStorage.getItem("rosella_wishlist") || "[]");
        setWishlisted(list.some((item: Product) => item.id === product.id));
      } catch {
        setWishlisted(false);
      }
    };
    window.addEventListener("rosella_wishlist_changed", syncWishlistState);
    window.addEventListener("storage", syncWishlistState);
    return () => {
      window.removeEventListener("rosella_wishlist_changed", syncWishlistState);
      window.removeEventListener("storage", syncWishlistState);
    };
  }, [product.id]);

  const discount = useMemo(() => {
    if (!product.originalPrice || product.originalPrice <= product.price) return 0;
    return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
  }, [product.originalPrice, product.price]);

  const handleAddToCart = useCallback(() => {
    onAddToCart(product);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 1800);
  }, [onAddToCart, product]);

  const handleToggleWishlist = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
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
  }, [product]);

  const handleQuickView = useCallback(() => {
    onQuickView(product);
  }, [onQuickView, product]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="group relative flex flex-col rounded-2xl overflow-hidden"
      style={{
        background: "#111009",
        boxShadow: "0 4px 24px rgba(0,0,0,0.5)",
        border: `1px solid rgba(201,168,76,0.14)`,
        transition: "box-shadow 0.3s ease, transform 0.3s ease",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={{ y: -5, boxShadow: "0 20px 60px rgba(201,168,76,0.18)" }}
    >
      {/* Image Area */}
      <div className="relative overflow-hidden" style={{ aspectRatio: "3/4", background: "#0a0800" }}>
        <ImageWithFallback
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
          style={{ transition: "transform 0.7s ease" }}
        />

        {/* Gradient overlay on hover */}
        <div
          className="absolute inset-0 transition-opacity duration-300"
          style={{
            background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 55%)",
            opacity: hovered ? 1 : 0.3,
          }}
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {discount > 0 && (
            <span
              className="px-2.5 py-1 rounded-full text-black"
              style={{
                background: `linear-gradient(135deg, ${GOLD}, #E0C87A)`,
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.68rem",
                fontWeight: 700,
                letterSpacing: "0.05em",
              }}
            >
              -{discount}%
            </span>
          )}
          {product.isNew && (
            <span
              className="px-2.5 py-1 rounded-full"
              style={{
                background: "rgba(201,168,76,0.15)",
                border: `1px solid rgba(201,168,76,0.4)`,
                color: GOLD,
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.68rem",
                fontWeight: 600,
                letterSpacing: "0.05em",
              }}
            >
              NEW
            </span>
          )}
          {product.isTrending && (
            <span
              className="px-2.5 py-1 rounded-full flex items-center gap-1"
              style={{
                background: "rgba(201,168,76,0.1)",
                border: `1px solid rgba(201,168,76,0.3)`,
                color: "#E0C87A",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.65rem",
                fontWeight: 600,
              }}
            >
              <Zap size={9} fill="#E0C87A" /> HOT
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button
          onClick={handleToggleWishlist}
          className="absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200"
          style={{
            background: wishlisted ? GOLD : "rgba(10,8,0,0.75)",
            backdropFilter: "blur(8px)",
            border: `1px solid rgba(201,168,76,${wishlisted ? "0.8" : "0.3"})`,
          }}
          aria-label="Wishlist"
        >
          <Heart
            size={15}
            fill={wishlisted ? "#000" : "none"}
            stroke={wishlisted ? "#000" : GOLD}
          />
        </button>

        {/* Quick View */}
        <AnimatePresence>
          {hovered && (
            <motion.button
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.15 }}
              onClick={handleQuickView}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 rounded-full"
              style={{
                background: "rgba(201,168,76,0.18)",
                backdropFilter: "blur(12px)",
                border: `1px solid rgba(201,168,76,0.55)`,
                color: "#E0C87A",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.75rem",
                letterSpacing: "0.08em",
                fontWeight: 500,
                whiteSpace: "nowrap",
              }}
            >
              <Eye size={13} />
              Quick View
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Info */}
      <div className="flex flex-col gap-2.5 p-4">
        {/* Category */}
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "0.65rem",
            letterSpacing: "0.2em",
            color: GOLD,
            textTransform: "uppercase",
            fontWeight: 500,
          }}
        >
          {product.category}
        </p>

        {/* Name */}
        <h3
          className="line-clamp-2"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "0.95rem",
            fontWeight: 500,
            color: "#F0E8D0",
            lineHeight: 1.35,
          }}
        >
          {product.name}
        </h3>

        {/* Stars */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={11}
                fill={i < Math.floor(product.rating) ? GOLD : "none"}
                stroke={i < Math.floor(product.rating) ? GOLD : "rgba(201,168,76,0.35)"}
              />
            ))}
          </div>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.7rem", color: "rgba(201,168,76,0.6)" }}>
            ({product.reviewCount})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mt-0.5">
          <span
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "1.1rem",
              fontWeight: 700,
              color: GOLD,
              letterSpacing: "0.02em",
            }}
          >
            {formatCurrency(product.price)}
          </span>
          {product.originalPrice > product.price && (
            <span
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.78rem",
                color: "rgba(240,232,208,0.35)",
                textDecoration: "line-through",
              }}
            >
              {formatCurrency(product.originalPrice)}
            </span>
          )}
        </div>

        {/* Add to Cart */}
        <button
          onClick={handleAddToCart}
          className="mt-1 w-full flex items-center justify-center gap-2 py-2.5 rounded-full transition-all duration-300"
          style={{
            background: addedToCart
              ? "rgba(201,168,76,0.15)"
              : "var(--primary-cta-background)",
            color: addedToCart ? GOLD : "#000",
            border: addedToCart ? `1px solid rgba(201,168,76,0.4)` : "none",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "0.8rem",
            fontWeight: 600,
            letterSpacing: "0.06em",
            cursor: "pointer",
          }}
        >
          <ShoppingBag size={14} />
          {addedToCart ? "Added ✓" : "Add to Cart"}
        </button>
      </div>
    </motion.div>
  );
}

export const ProductCard = memo(ProductCardComponent);
