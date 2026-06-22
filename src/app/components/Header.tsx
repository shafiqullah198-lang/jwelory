import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router";
import { ShoppingBag, Heart, Search, Menu, X, ChevronDown, User as UserIcon } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "./AuthContext";
import { apiFetch } from "../api";
import { BrandLogo } from "./BrandLogo";
import { formatCurrency } from "../utils";

export const CATEGORY_TYPOS: Record<string, string> = {
  earing: "Earrings",
  earings: "Earrings",
  earring: "Earrings",
  earrings: "Earrings",
  necklace: "Necklaces",
  necklaces: "Necklaces",
  neckles: "Necklaces",
  neckless: "Necklaces",
  neckle: "Necklaces",
  neckleses: "Necklaces",
  ring: "Rings",
  rings: "Rings",
  bracelet: "Bracelets",
  bracelets: "Bracelets",
  bangle: "Bangles",
  bangles: "Bangles",
  set: "Sets",
  sets: "Sets",
};

interface HeaderProps {
  cartCount: number;
  wishlistCount: number;
  onCartClick: () => void;
  onWishlistClick: () => void;
}

const navLinks = [
  { label: "Collections", to: "/products", hasDropdown: true },
  { label: "New Arrivals", to: "/new-arrivals" },
  { label: "Best Sellers", to: "/best-sellers" },
  { label: "Sale", to: "/sale", highlight: true },
  { label: "About", to: "/about" },
];

export function Header({ cartCount, wishlistCount, onCartClick, onWishlistClick }: HeaderProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [categories, setCategories] = useState<string[]>(["Earrings", "Necklaces", "Rings", "Bracelets", "Bangles", "Sets"]);

  useEffect(() => {
    async function loadCats() {
      try {
        const data = await apiFetch("products/categories/");
        if (data && data.categories) {
          setCategories(data.categories.map((c: any) => c.name));
        }
      } catch (e) {
        console.error("Failed to fetch header categories:", e);
      }
    }
    loadCats();
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Live search with debounce
  const fetchSearchResults = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setSearchLoading(false);
      return;
    }
    setSearchLoading(true);
    try {
      const trimmed = query.trim().toLowerCase();
      let url = `products/?q=${encodeURIComponent(query.trim())}`;
      
      if (CATEGORY_TYPOS[trimmed]) {
        const matchedCategory = CATEGORY_TYPOS[trimmed];
        const categorySlug = matchedCategory === "Sets" ? "sets" : matchedCategory.toLowerCase();
        url = `products/?category=${categorySlug}`;
      }
      
      const data = await apiFetch(url);
      if (data && data.products) {
        setSearchResults(data.products.slice(0, 6));
      } else {
        setSearchResults([]);
      }
    } catch (err) {
      console.error("Search failed:", err);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!searchOpen) return;
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setSearchLoading(false);
      return;
    }
    setSearchLoading(true);
    searchTimerRef.current = setTimeout(() => {
      fetchSearchResults(searchQuery);
    }, 300);
    return () => {
      if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    };
  }, [searchQuery, searchOpen, fetchSearchResults]);

  return (
    <>
      {/* Announcement Bar */}
      <div
        className="w-full text-center py-2 text-xs tracking-widest uppercase"
        style={{ background: "#060400", color: "rgba(201,168,76,0.85)", fontFamily: "'DM Sans', sans-serif", borderBottom: "1px solid rgba(201,168,76,0.15)" }}
      >
        ✦ Free shipping on orders over Rs. 5,000 | Use code LUXURY15 for 15% off ✦
      </div>

      <header
        className="sticky top-0 z-50 w-full transition-all duration-500"
        style={{
          background: scrolled
            ? "rgba(4,3,0,0.96)"
            : "rgba(4,3,0,0.88)",
          backdropFilter: "blur(20px)",
          borderBottom: scrolled ? "1px solid rgba(201,168,76,0.18)" : "1px solid rgba(201,168,76,0.08)",
          boxShadow: scrolled ? "0 4px 40px rgba(0,0,0,0.5)" : "none",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex leading-none select-none">
            <BrandLogo
              containerClassName="gap-2.5 md:gap-3"
              imageClassName="h-[38px] w-[38px] md:h-12 md:w-12 shrink-0 object-contain"
              titleClassName="text-[0.78rem] sm:text-[0.86rem] md:text-[1rem] font-semibold tracking-[0.14em] text-[var(--rose-gold)]"
              taglineClassName="mt-1 text-[0.48rem] md:text-[0.52rem] tracking-[0.28em] uppercase text-[var(--muted-foreground)]"
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) =>
              link.hasDropdown ? (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => setDropdownOpen(true)}
                  onMouseLeave={() => setDropdownOpen(false)}
                >
                  <button
                    className="flex items-center gap-1 transition-colors duration-200"
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "0.875rem",
                      letterSpacing: "0.05em",
                      color: dropdownOpen ? "var(--rose-gold)" : "#F0E8D0",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                    }}
                    onClick={() => setDropdownOpen((o) => !o)}
                  >
                    {link.label}
                    <ChevronDown size={14} className={`transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} />
                  </button>
                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.18 }}
                        className="absolute top-full left-0 mt-3 py-3 rounded-2xl shadow-xl min-w-48"
                        style={{
                          background: "rgba(8,6,0,0.97)",
                          backdropFilter: "blur(24px)",
                          border: "1px solid rgba(201,168,76,0.2)",
                        }}
                      >
                        {categories.map((cat) => (
                          <Link
                            key={cat}
                            to={`/products?category=${encodeURIComponent(cat)}`}
                            className="block px-5 py-2 text-sm transition-colors duration-150 hover:bg-accent"
                            style={{ fontFamily: "'DM Sans', sans-serif", color: "#F0E8D0", textDecoration: "none" }}
                            onClick={() => setDropdownOpen(false)}
                          >
                            {cat}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  key={link.label}
                  to={link.to || "/"}
                  className="transition-colors duration-200 hover:opacity-70"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "0.875rem",
                    letterSpacing: "0.05em",
                    color: link.highlight ? "var(--rose-gold)" : "var(--foreground)",
                    fontWeight: link.highlight ? 600 : 400,
                    textDecoration: "none",
                  }}
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>

          {/* Icons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 rounded-full transition-all duration-200 hover:bg-secondary"
              style={{ color: "#F0E8D0" }}
              aria-label="Search"
            >
              <Search size={20} />
            </button>
            <button
              onClick={onWishlistClick}
              className="p-2 rounded-full transition-all duration-200 hover:bg-secondary relative"
              style={{ color: "#F0E8D0" }}
              aria-label="Wishlist"
            >
              <Heart size={20} />
              {wishlistCount > 0 && (
                <span
                  className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center text-white"
                  style={{ fontSize: "0.6rem", background: "var(--rose-gold)" }}
                >
                  {wishlistCount}
                </span>
              )}
            </button>
            <button
              onClick={onCartClick}
              className="p-2 rounded-full transition-all duration-200 hover:bg-secondary relative"
              style={{ color: "#F0E8D0" }}
              aria-label="Cart"
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span
                  className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center text-white"
                  style={{ fontSize: "0.6rem", background: "var(--rose-gold)" }}
                >
                  {cartCount}
                </span>
              )}
            </button>
            {user ? (
              <Link
                to="/profile"
                className="p-2 rounded-full transition-all duration-200 hover:bg-secondary flex items-center justify-center"
                aria-label="Profile"
              >
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold"
                  style={{ background: "linear-gradient(135deg, var(--rose-gold), var(--rose-gold-dark))" }}
                >
                  {user.first_name ? user.first_name[0].toUpperCase() : user.username[0].toUpperCase()}
                </div>
              </Link>
            ) : (
              <Link
                to="/login"
                className="p-2 rounded-full transition-all duration-200 hover:bg-secondary flex items-center justify-center"
                style={{ color: "#F0E8D0" }}
                aria-label="Login"
              >
                <UserIcon size={20} />
              </Link>
            )}
            <button
              className="lg:hidden p-2 rounded-full transition-all duration-200 hover:bg-secondary"
              onClick={() => setMobileOpen(true)}
              aria-label="Menu"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </header>

      {/* Search Overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-start justify-center pt-24 px-4"
            style={{ background: "rgba(43,43,43,0.6)", backdropFilter: "blur(8px)" }}
            onClick={() => { setSearchOpen(false); setSearchQuery(""); setSearchResults([]); }}
          >
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl"
            >
              {/* Search Input */}
              <div
                className="flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl"
                style={{
                  background: "#fff",
                  border: "2px solid var(--rose-gold)",
                  borderRadius: searchQuery.trim() ? "1rem 1rem 0 0" : "1rem",
                }}
              >
                <Search size={22} style={{ color: "var(--rose-gold)" }} />
                <input
                  autoFocus
                  placeholder="Search for earrings, necklaces, rings..."
                  className="flex-1 outline-none bg-transparent text-black"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "1.1rem",
                    color: "#000",
                  }}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && searchQuery.trim()) {
                      setSearchOpen(false);
                      setSearchQuery("");
                      setSearchResults([]);
                      navigate(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
                    }
                    if (e.key === "Escape") {
                      setSearchOpen(false);
                      setSearchQuery("");
                      setSearchResults([]);
                    }
                  }}
                />
                {searchQuery && (
                  <button
                    onClick={() => { setSearchQuery(""); setSearchResults([]); }}
                    className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <X size={16} style={{ color: "#999" }} />
                  </button>
                )}
                <button onClick={() => { setSearchOpen(false); setSearchQuery(""); setSearchResults([]); }}>
                  <X size={20} style={{ color: "var(--muted-foreground)" }} />
                </button>
              </div>

              {/* Live Search Results Dropdown */}
              {searchQuery.trim() && (
                <div
                  className="rounded-b-2xl shadow-2xl overflow-hidden"
                  style={{
                    background: "#fff",
                    borderLeft: "2px solid var(--rose-gold)",
                    borderRight: "2px solid var(--rose-gold)",
                    borderBottom: "2px solid var(--rose-gold)",
                    maxHeight: "420px",
                    overflowY: "auto",
                  }}
                >
                  {searchLoading ? (
                    <div className="flex items-center justify-center py-8 gap-2">
                      <div
                        className="w-4 h-4 rounded-full animate-spin"
                        style={{ border: "2px solid rgba(201,168,76,0.2)", borderTopColor: "var(--rose-gold)" }}
                      />
                      <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.85rem", color: "#888" }}>
                        Searching...
                      </span>
                    </div>
                  ) : searchResults.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 px-4">
                      <Search size={28} style={{ color: "rgba(201,168,76,0.4)", marginBottom: 8 }} />
                      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.9rem", color: "#888", textAlign: "center" }}>
                        No jewelry found
                      </p>
                      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.75rem", color: "#bbb", marginTop: 4 }}>
                        Try a different keyword or browse our collections.
                      </p>
                    </div>
                  ) : (
                    <>
                      {searchResults.map((product) => (
                        <Link
                          key={product.id}
                          to={`/products/${product.slug}`}
                          onClick={() => { setSearchOpen(false); setSearchQuery(""); setSearchResults([]); }}
                          className="flex items-center gap-4 px-5 py-3 transition-colors hover:bg-gray-50"
                          style={{ textDecoration: "none", borderBottom: "1px solid #f0f0f0" }}
                        >
                          <div
                            className="w-12 h-12 rounded-xl overflow-hidden shrink-0"
                            style={{ background: "#f5f5f0" }}
                          >
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p
                              className="truncate"
                              style={{
                                fontFamily: "'Playfair Display', serif",
                                fontSize: "0.88rem",
                                fontWeight: 600,
                                color: "#1a1a1a",
                              }}
                            >
                              {product.name}
                            </p>
                            <p
                              style={{
                                fontFamily: "'DM Sans', sans-serif",
                                fontSize: "0.7rem",
                                color: "#999",
                                textTransform: "uppercase",
                                letterSpacing: "0.1em",
                              }}
                            >
                              {product.category}
                            </p>
                          </div>
                          <div className="text-right shrink-0">
                            <p
                              style={{
                                fontFamily: "'Playfair Display', serif",
                                fontSize: "0.9rem",
                                fontWeight: 700,
                                color: "#8B6914",
                              }}
                            >
                              {formatCurrency(product.currentPrice)}
                            </p>
                            {product.currentPrice < product.price && (
                              <p
                                style={{
                                  fontFamily: "'DM Sans', sans-serif",
                                  fontSize: "0.7rem",
                                  color: "#bbb",
                                  textDecoration: "line-through",
                                }}
                              >
                                {formatCurrency(product.price)}
                              </p>
                            )}
                          </div>
                        </Link>
                      ))}
                      {/* View All Results */}
                      <button
                        onClick={() => {
                          setSearchOpen(false);
                          const q = searchQuery.trim();
                          setSearchQuery("");
                          setSearchResults([]);
                          navigate(`/products?q=${encodeURIComponent(q)}`);
                        }}
                        className="w-full py-3 text-center transition-colors hover:bg-gray-50"
                        style={{
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: "0.85rem",
                          fontWeight: 600,
                          color: "#8B6914",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                        }}
                      >
                        View all results →
                      </button>
                    </>
                  )}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed inset-y-0 right-0 z-[100] w-80 flex flex-col shadow-2xl"
            style={{ background: "#080600" }}
          >
            <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: "rgba(201,168,76,0.18)" }}>
              <BrandLogo
                showTagline={false}
                containerClassName="gap-2.5"
                imageClassName="h-[38px] w-[38px] shrink-0 object-contain"
                titleClassName="text-[0.78rem] font-semibold tracking-[0.12em] text-[var(--rose-gold)]"
              />
              <button onClick={() => setMobileOpen(false)} className="p-2 rounded-full hover:bg-secondary">
                <X size={22} />
              </button>
            </div>
            <nav className="flex-1 p-6 flex flex-col gap-1 overflow-y-auto">
              {categories.map((cat) => (
                <Link
                  key={cat}
                  to={`/products?category=${encodeURIComponent(cat)}`}
                  onClick={() => setMobileOpen(false)}
                  className="py-3 px-4 rounded-xl transition-colors hover:bg-secondary"
                  style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--foreground)", fontSize: "1rem", textDecoration: "none" }}
                >
                  {cat}
                </Link>
              ))}
              <div className="my-3 border-t" style={{ borderColor: "rgba(201,168,76,0.18)" }} />
              <Link
                to="/new-arrivals"
                onClick={() => setMobileOpen(false)}
                className="py-3 px-4 rounded-xl transition-colors hover:bg-secondary"
                style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--foreground)", textDecoration: "none" }}
              >
                New Arrivals
              </Link>
              <Link
                to="/best-sellers"
                onClick={() => setMobileOpen(false)}
                className="py-3 px-4 rounded-xl transition-colors hover:bg-secondary"
                style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--foreground)", textDecoration: "none" }}
              >
                Best Sellers
              </Link>
              <Link
                to="/sale"
                onClick={() => setMobileOpen(false)}
                className="py-3 px-4 rounded-xl transition-colors hover:bg-secondary"
                style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--rose-gold)", fontWeight: 600, textDecoration: "none" }}
              >
                Sale
              </Link>
              <Link
                to="/about"
                onClick={() => setMobileOpen(false)}
                className="py-3 px-4 rounded-xl transition-colors hover:bg-secondary"
                style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--foreground)", textDecoration: "none" }}
              >
                About Us
              </Link>
              <div className="my-3 border-t" style={{ borderColor: "rgba(201,168,76,0.18)" }} />
              {user ? (
                <Link
                  to="/profile"
                  onClick={() => setMobileOpen(false)}
                  className="py-3 px-4 rounded-xl transition-colors hover:bg-secondary"
                  style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--foreground)", textDecoration: "none" }}
                >
                  My Profile
                </Link>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="py-3 px-4 rounded-xl transition-colors hover:bg-secondary"
                  style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--foreground)", textDecoration: "none" }}
                >
                  Sign In
                </Link>
              )}
            </nav>
            <div className="p-6 border-t" style={{ borderColor: "var(--border)" }}>
              <button
                className="w-full py-3 rounded-full text-white font-medium transition-all"
                style={{ background: "var(--rose-gold)", fontFamily: "'DM Sans', sans-serif" }}
              >
                Shop Now
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
