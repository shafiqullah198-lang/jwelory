import { useState, useMemo } from "react";
import { SlidersHorizontal, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ProductCard, type Product } from "./ProductCard";

const CATEGORY_TABS = ["All", "Earrings", "Necklaces", "Rings", "Bracelets", "Bangles", "Sets"];

const SORT_OPTIONS = [
  { label: "Featured", value: "featured" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Best Rating", value: "rating" },
  { label: "Newest First", value: "newest" },
];

export const ALL_PRODUCTS: Product[] = [
  { id: 1, name: "Rose Gold Pearl Drop Earrings", category: "Earrings", price: 849, originalPrice: 1299, rating: 4.9, reviewCount: 234, image: "https://images.unsplash.com/photo-1723726871280-ab921c7e60c0?w=400&h=500&fit=crop&auto=format", isNew: true, isTrending: true },
  { id: 2, name: "Delicate Heart Pendant Necklace", category: "Necklaces", price: 1099, originalPrice: 1599, rating: 4.8, reviewCount: 189, image: "https://images.unsplash.com/photo-1513122991877-4a5678e6d72f?w=400&h=500&fit=crop&auto=format", isTrending: true },
  { id: 3, name: "Gold Floral Statement Ring", category: "Rings", price: 699, originalPrice: 999, rating: 4.7, reviewCount: 312, image: "https://images.unsplash.com/photo-1592752411524-e823937f60dd?w=400&h=500&fit=crop&auto=format", isNew: true },
  { id: 4, name: "Charm Bead Bracelet Set", category: "Bracelets", price: 1249, originalPrice: 1799, rating: 4.9, reviewCount: 156, image: "https://images.unsplash.com/photo-1633934542430-0905ccb5f050?w=400&h=500&fit=crop&auto=format" },
  { id: 5, name: "Layered Gold Hoop Earrings", category: "Earrings", price: 649, originalPrice: 899, rating: 4.6, reviewCount: 421, image: "https://images.unsplash.com/photo-1632525231035-c054cd5019db?w=400&h=500&fit=crop&auto=format", isTrending: true },
  { id: 6, name: "Antique Rose Necklace Set", category: "Sets", price: 2499, originalPrice: 3499, rating: 4.9, reviewCount: 98, image: "https://images.unsplash.com/photo-1777126413365-f4113a23eeab?w=400&h=500&fit=crop&auto=format", isNew: true },
  { id: 7, name: "Crystal Bangle Trio", category: "Bangles", price: 899, originalPrice: 1299, rating: 4.7, reviewCount: 267, image: "https://images.unsplash.com/photo-1702476320482-0736c4b962f5?w=400&h=500&fit=crop&auto=format" },
  { id: 8, name: "Solitaire Diamond Ring", category: "Rings", price: 1599, originalPrice: 2199, rating: 4.8, reviewCount: 143, image: "https://images.unsplash.com/photo-1588909006332-2e30f95291bc?w=400&h=500&fit=crop&auto=format", isTrending: true },
  { id: 9, name: "Floral Jhumka Earrings", category: "Earrings", price: 549, originalPrice: 799, rating: 4.5, reviewCount: 534, image: "https://images.unsplash.com/photo-1692521248622-98a1da77b673?w=400&h=500&fit=crop&auto=format", isNew: true },
  { id: 10, name: "Pearl Layered Necklace", category: "Necklaces", price: 1349, originalPrice: 1899, rating: 4.8, reviewCount: 176, image: "https://images.unsplash.com/photo-1704957205144-299bbf127891?w=400&h=500&fit=crop&auto=format" },
  { id: 11, name: "Gold Mangalsutra Chain", category: "Necklaces", price: 1899, originalPrice: 2499, rating: 4.9, reviewCount: 312, image: "https://images.unsplash.com/photo-1717282924908-1c0262e4b136?w=400&h=500&fit=crop&auto=format", isTrending: true },
  { id: 12, name: "Infinity Twist Bracelet", category: "Bracelets", price: 799, originalPrice: 1099, rating: 4.6, reviewCount: 208, image: "https://images.unsplash.com/photo-1565817292726-56c96f34355b?w=400&h=500&fit=crop&auto=format" },
  { id: 13, name: "Temple Design Jhumkas", category: "Earrings", price: 749, originalPrice: 999, rating: 4.7, reviewCount: 389, image: "https://images.unsplash.com/photo-1720686615374-ea04dac6a66e?w=400&h=500&fit=crop&auto=format", isNew: true },
  { id: 14, name: "Kundan Bridal Set", category: "Sets", price: 3499, originalPrice: 4999, rating: 4.9, reviewCount: 67, image: "https://images.unsplash.com/photo-1773097258713-a7ccd75e2aac?w=400&h=500&fit=crop&auto=format" },
  { id: 15, name: "Oxidised Silver Bangles (Set of 6)", category: "Bangles", price: 649, originalPrice: 899, rating: 4.5, reviewCount: 456, image: "https://images.unsplash.com/photo-1723361656146-f201d215c49c?w=400&h=500&fit=crop&auto=format", isTrending: true },
  { id: 16, name: "Gold Adjustable Ring", category: "Rings", price: 449, originalPrice: 649, rating: 4.4, reviewCount: 612, image: "https://images.unsplash.com/photo-1592752411563-02ee3ef57f2b?w=400&h=500&fit=crop&auto=format" },
  { id: 17, name: "Butterfly Charm Necklace", category: "Necklaces", price: 949, originalPrice: 1299, rating: 4.7, reviewCount: 234, image: "https://images.unsplash.com/photo-1558882268-15aa056d885f?w=400&h=500&fit=crop&auto=format", isNew: true },
  { id: 18, name: "Diamond-Cut Hoop Earrings", category: "Earrings", price: 999, originalPrice: 1399, rating: 4.8, reviewCount: 178, image: "https://images.unsplash.com/photo-1764265923632-b2126ec0dedc?w=400&h=500&fit=crop&auto=format" },
  { id: 19, name: "Floral Meenakari Set", category: "Sets", price: 2799, originalPrice: 3999, rating: 4.9, reviewCount: 89, image: "https://images.unsplash.com/photo-1762122944695-4ee7032b7c9e?w=400&h=500&fit=crop&auto=format", isTrending: true },
  { id: 20, name: "Tennis Bracelet Gold", category: "Bracelets", price: 1699, originalPrice: 2299, rating: 4.8, reviewCount: 145, image: "https://images.unsplash.com/photo-1779406084084-d47bb281136c?w=400&h=500&fit=crop&auto=format" },
  { id: 21, name: "Stackable Thin Bangles (4 pcs)", category: "Bangles", price: 499, originalPrice: 699, rating: 4.6, reviewCount: 523, image: "https://images.unsplash.com/photo-1702476320482-0736c4b962f5?w=400&h=500&fit=crop&auto=format&crop=top", isNew: true },
  { id: 22, name: "Emerald Drop Earrings", category: "Earrings", price: 1199, originalPrice: 1699, rating: 4.9, reviewCount: 201, image: "https://images.unsplash.com/photo-1723726871280-ab921c7e60c0?w=400&h=500&fit=crop&auto=format&crop=center", isTrending: true },
  { id: 23, name: "Rose Gold Chain Necklace", category: "Necklaces", price: 1099, originalPrice: 1499, rating: 4.7, reviewCount: 167, image: "https://images.unsplash.com/photo-1513122991877-4a5678e6d72f?w=400&h=500&fit=crop&auto=format&crop=top" },
  { id: 24, name: "Vintage Statement Ring", category: "Rings", price: 849, originalPrice: 1199, rating: 4.8, reviewCount: 289, image: "https://images.unsplash.com/photo-1565817292726-56c96f34355b?w=400&h=500&fit=crop&auto=format&crop=top", isNew: true },
];

interface ProductGridProps {
  onAddToCart: (product: Product) => void;
  onQuickView: (product: Product) => void;
}

export function ProductGrid({ onAddToCart, onQuickView }: ProductGridProps) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("featured");
  const [sortOpen, setSortOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(12);

  const filtered = useMemo(() => {
    let items = ALL_PRODUCTS.filter(
      (p) => activeCategory === "All" || p.category === activeCategory || (activeCategory === "Sets" && p.category === "Sets")
    );
    if (sortBy === "price-asc") items = [...items].sort((a, b) => a.price - b.price);
    else if (sortBy === "price-desc") items = [...items].sort((a, b) => b.price - a.price);
    else if (sortBy === "rating") items = [...items].sort((a, b) => b.rating - a.rating);
    else if (sortBy === "newest") items = [...items].filter((p) => p.isNew).concat(items.filter((p) => !p.isNew));
    return items;
  }, [activeCategory, sortBy]);

  const visible = filtered.slice(0, visibleCount);

  return (
    <section id="collections" className="py-20 md:py-28" style={{ background: "#060400" }}>
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <p
            className="mb-3"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.75rem",
              letterSpacing: "0.25em",
              color: "var(--rose-gold)",
              textTransform: "uppercase",
              fontWeight: 500,
            }}
          >
            ✦ Curated For You ✦
          </p>
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: 600,
              color: "var(--foreground)",
            }}
          >
            Our Jewelry Collection
          </h2>
        </div>

        {/* Filters row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 flex-wrap">
            {CATEGORY_TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => { setActiveCategory(tab); setVisibleCount(12); }}
                className="px-4 py-2 rounded-full transition-all duration-200"
                style={{
                  background: activeCategory === tab ? "var(--rose-gold)" : "rgba(201,168,76,0.08)",
                  color: activeCategory === tab ? "#fff" : "var(--foreground)",
                  border: activeCategory === tab ? "none" : "1px solid rgba(201,168,76,0.2)",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.82rem",
                  fontWeight: activeCategory === tab ? 600 : 400,
                  letterSpacing: "0.03em",
                  cursor: "pointer",
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <button
              onClick={() => setSortOpen((o) => !o)}
              className="flex items-center gap-2 px-4 py-2 rounded-full"
              style={{
                border: "1px solid rgba(201,168,76,0.25)",
                background: "#fff",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.82rem",
                color: "var(--foreground)",
                cursor: "pointer",
              }}
            >
              <SlidersHorizontal size={14} style={{ color: "var(--rose-gold)" }} />
              {SORT_OPTIONS.find((o) => o.value === sortBy)?.label}
              <ChevronDown size={13} className={`transition-transform ${sortOpen ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence>
              {sortOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  className="absolute right-0 top-full mt-2 py-2 rounded-2xl shadow-xl z-20 min-w-48"
                  style={{ background: "#080600", border: "1px solid rgba(201,168,76,0.18)" }}
                >
                  {SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => { setSortBy(opt.value); setSortOpen(false); }}
                      className="w-full text-left px-5 py-2.5 transition-colors hover:bg-secondary"
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: "0.85rem",
                        color: sortBy === opt.value ? "var(--rose-gold)" : "var(--foreground)",
                        fontWeight: sortBy === opt.value ? 600 : 400,
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Results count */}
        <p className="mb-6" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.82rem", color: "var(--muted-foreground)" }}>
          Showing {Math.min(visibleCount, filtered.length)} of {filtered.length} products
        </p>

        {/* Products Grid */}
        <motion.div
          layout
          className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
        >
          <AnimatePresence>
            {visible.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
                onQuickView={onQuickView}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Load More */}
        {visibleCount < filtered.length && (
          <div className="flex justify-center mt-12">
            <button
              onClick={() => setVisibleCount((c) => c + 8)}
              className="px-10 py-3.5 rounded-full transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
              style={{
                border: "1.5px solid var(--rose-gold)",
                color: "var(--rose-gold)",
                background: "#fff",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.9rem",
                fontWeight: 500,
                letterSpacing: "0.05em",
                cursor: "pointer",
              }}
            >
              Load More Products ({filtered.length - visibleCount} remaining)
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
