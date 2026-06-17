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

export const ALL_PRODUCTS: Product[] = [];

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
