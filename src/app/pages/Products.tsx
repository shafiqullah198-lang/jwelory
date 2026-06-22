import React, { useState, useEffect, useMemo } from "react";
import { apiFetch } from "../api";
import { SlidersHorizontal, ChevronDown, Search, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ProductCard, type Product } from "../components/ProductCard";
import { useSearchParams, useParams, useLocation } from "react-router";
import { CATEGORY_TYPOS } from "../components/Header";

const SORT_OPTIONS = [
  { label: "Featured", value: "featured" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Best Rating", value: "rating" },
  { label: "Newest First", value: "newest" },
];

interface ProductsProps {
  onAddToCart: (product: Product) => void;
  onQuickView: (product: Product) => void;
}

export default function Products({ onAddToCart, onQuickView }: ProductsProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const { slug } = useParams();
  const location = useLocation();

  const initialCategory = searchParams.get("category") || "All";
  const initialSearch = searchParams.get("q") || "";
  const initialSort = searchParams.get("sort") || "featured";
  const initialFilter = searchParams.get("filter") || "";

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState(initialSort);
  const [sortOpen, setSortOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);
  const [activeFilter, setActiveFilter] = useState(initialFilter);
  const [visibleCount, setVisibleCount] = useState(12);
  const [categoryTabs, setCategoryTabs] = useState<string[]>(["All", "Earrings", "Necklaces", "Rings", "Bracelets", "Bangles", "Sets"]);

  useEffect(() => {
    async function loadTabs() {
      try {
        const data = await apiFetch("products/categories/");
        if (data && data.categories) {
          setCategoryTabs(["All", ...data.categories.map((c: any) => c.name)]);
        }
      } catch (err) {
        console.error("Failed to load catalog category tabs:", err);
      }
    }
    loadTabs();
  }, []);

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Sync category, search, sorting and tag filters when searchParams URL changes
  useEffect(() => {
    const category = searchParams.get("category") || "All";
    const sort = searchParams.get("sort") || "featured";
    const query = searchParams.get("q") || "";
    const filter = searchParams.get("filter") || "";

    const lowerQ = query.trim().toLowerCase();
    if (lowerQ && CATEGORY_TYPOS[lowerQ]) {
      setActiveCategory(CATEGORY_TYPOS[lowerQ]);
      setSearchQuery("");
      setDebouncedSearch("");
    } else {
      setActiveCategory(category);
      setSearchQuery(query);
      setDebouncedSearch(query);
    }
    setSortBy(sort);
    setActiveFilter(filter);
  }, [searchParams]);

  // Sync state from pathname/slug (for collections/:slug, new arrivals, etc.)
  useEffect(() => {
    if (location.pathname === "/new-arrivals") {
      setActiveFilter("new");
      setActiveCategory("All");
    } else if (location.pathname === "/best-sellers") {
      setActiveFilter("featured");
      setActiveCategory("All");
    } else if (location.pathname === "/sale") {
      setActiveFilter("sale");
      setActiveCategory("All");
    } else if (location.pathname.startsWith("/collections")) {
      if (slug) {
        const found = categoryTabs.find(t => {
          const tabSlug = (t === "Sets" || t === "Jewelry Sets") ? "sets" : t.toLowerCase();
          return tabSlug === slug;
        });
        if (found) {
          setActiveCategory(found);
        }
      } else {
        setActiveCategory("All");
      }
      setActiveFilter("");
    }
  }, [location.pathname, slug, categoryTabs]);

  // Sync states to searchParams URL
  useEffect(() => {
    const params: Record<string, string> = {};
    if (activeCategory !== "All") params.category = activeCategory;
    if (sortBy !== "featured") params.sort = sortBy;
    if (debouncedSearch) params.q = debouncedSearch;
    if (activeFilter) params.filter = activeFilter;
    setSearchParams(params);
  }, [activeCategory, sortBy, debouncedSearch, activeFilter]);

  // Fetch products from Django REST API
  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      try {
        let endpoint = "products/?";
        if (activeCategory !== "All") {
          const categorySlug = activeCategory === "Sets" ? "sets" : activeCategory.toLowerCase();
          endpoint += `category=${categorySlug}&`;
        }
        if (sortBy !== "featured") {
          endpoint += `sort=${sortBy}&`;
        }
        if (debouncedSearch) {
          endpoint += `q=${encodeURIComponent(debouncedSearch)}&`;
        }
        if (activeFilter) {
          endpoint += `filter=${activeFilter}&`;
        }

        const data = await apiFetch(endpoint);
        if (data && data.products) {
          const mappedProducts = data.products.map((p: any) => ({
            id: p.id,
            name: p.name,
            slug: p.slug,
            category: p.category,
            price: p.currentPrice,
            originalPrice: p.price,
            rating: p.rating,
            reviewCount: p.reviewCount,
            image: p.image,
            isNew: p.isNew,
            isTrending: p.isTrending,
            inStock: p.inStock,
          }));
          setProducts(mappedProducts);
        }
      } catch (err) {
        console.error("Error loading products:", err);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, [activeCategory, sortBy, debouncedSearch, activeFilter]);

  const visibleProducts = useMemo(() => {
    return products.slice(0, visibleCount);
  }, [products, visibleCount]);

  return (
    <div className="min-h-screen py-16 md:py-20" style={{ background: "#060400" }}>
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <p
            className="mb-3 text-xs tracking-[0.25em] uppercase font-semibold"
            style={{ color: "var(--rose-gold)" }}
          >
            ✦ Curated For You ✦
          </p>
          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: 600,
              color: "var(--foreground)",
            }}
          >
            Our Jewelry Collection
          </h1>
        </div>

        {/* Filters and search row */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6 mb-8">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 flex-wrap order-2 lg:order-1">
            {categoryTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveCategory(tab);
                  setVisibleCount(12);
                }}
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

          {/* Search Input & Sort Dropdown */}
          <div className="flex flex-col sm:flex-row items-center gap-4 order-1 lg:order-2">
            {/* Search Input */}
            <div
              className="flex items-center gap-2 px-4 py-2 rounded-full w-full sm:w-64"
              style={{
                border: "1px solid rgba(201, 168, 76, 0.25)",
                background: "rgba(255,255,255,0.03)",
              }}
            >
              <Search size={16} style={{ color: "var(--rose-gold)" }} />
              <input
                type="text"
                placeholder="Search catalog..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent outline-none w-full text-xs text-[#F0E8D0]"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              />
            </div>

            {/* Sort Dropdown */}
            <div className="relative w-full sm:w-auto">
              <button
                onClick={() => setSortOpen((o) => !o)}
                className="flex items-center justify-between gap-2 px-4 py-2 rounded-full w-full sm:w-auto"
                style={{
                  border: "1px solid rgba(201,168,76,0.25)",
                  background: "#fff",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.82rem",
                  color: "var(--foreground)",
                  cursor: "pointer",
                }}
              >
                <span className="flex items-center gap-2">
                  <SlidersHorizontal size={14} style={{ color: "var(--rose-gold)" }} />
                  {SORT_OPTIONS.find((o) => o.value === sortBy)?.label}
                </span>
                <ChevronDown size={13} className={`transition-transform ${sortOpen ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {sortOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    className="absolute right-0 top-full mt-2 py-2 rounded-2xl shadow-xl z-20 min-w-48 w-full sm:w-auto"
                    style={{ background: "#080600", border: "1px solid rgba(201,168,76,0.18)" }}
                  >
                    {SORT_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => {
                          setSortBy(opt.value);
                          setSortOpen(false);
                        }}
                        className="w-full text-left px-5 py-2.5 transition-colors hover:bg-white/5"
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
        </div>

        {/* Results Info */}
        <div className="flex justify-between items-center mb-6 text-xs" style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--muted-foreground)" }}>
          {loading ? (
            <span className="flex items-center gap-1.5"><Loader2 size={12} className="animate-spin" /> Fetching jewelry...</span>
          ) : (
            <span>Showing {Math.min(visibleCount, products.length)} of {products.length} products</span>
          )}
        </div>

        {/* Products Grid */}
        {loading && products.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[40vh]">
            <Loader2 className="animate-spin mb-4" size={32} style={{ color: "var(--rose-gold)" }} />
            <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>Loading our collection...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-white/3 rounded-3xl border border-white/5">
            <p className="text-lg font-semibold mb-2" style={{ color: "#F0E8D0" }}>No products found</p>
            <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>Try adjusting your filters or search keywords.</p>
          </div>
        ) : (
          <>
            <motion.div
              layout
              className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
            >
              <AnimatePresence>
                {visibleProducts.map((product) => (
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
            {visibleCount < products.length && (
              <div className="flex justify-center mt-12">
                <button
                  onClick={() => setVisibleCount((c) => c + 8)}
                  className="px-10 py-3.5 rounded-full transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                  style={{
                    border: "1.5px solid var(--rose-gold)",
                    color: "var(--rose-gold)",
                    background: "transparent",
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "0.9rem",
                    fontWeight: 500,
                    letterSpacing: "0.05em",
                    cursor: "pointer",
                  }}
                >
                  Load More Products ({products.length - visibleCount} remaining)
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
