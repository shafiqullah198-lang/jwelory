import { useState } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import { Star, ArrowRight, Shield, Truck, RefreshCw, HeadphonesIcon, Instagram, Mail, CheckCircle2 } from "lucide-react";
import { ProductCard, type Product } from "./ProductCard";
import { BRAND_HASHTAG, BRAND_INSTAGRAM_HANDLE, BRAND_NAME, BrandLogo } from "./BrandLogo";

interface SectionsProps {
  onAddToCart: (p: Product) => void;
  onQuickView: (p: Product) => void;
}

/* ────────── CATEGORY SVG ICONS ────────── */
const IconEarrings = ({ color = "#C9A84C" }: { color?: string }) => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <line x1="13" y1="6" x2="13" y2="12" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
    <line x1="27" y1="6" x2="27" y2="12" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
    <circle cx="13" cy="5" r="1.8" stroke={color} strokeWidth="1.4" fill="none" />
    <circle cx="27" cy="5" r="1.8" stroke={color} strokeWidth="1.4" fill="none" />
    <path d="M10 12 Q10 20 13 26 Q16 32 13 34" stroke={color} strokeWidth="1.6" strokeLinecap="round" fill="none" />
    <path d="M24 12 Q24 20 27 26 Q30 32 27 34" stroke={color} strokeWidth="1.6" strokeLinecap="round" fill="none" />
    <ellipse cx="13" cy="34.5" rx="2.5" ry="1.8" stroke={color} strokeWidth="1.4" fill="none" />
    <ellipse cx="27" cy="34.5" rx="2.5" ry="1.8" stroke={color} strokeWidth="1.4" fill="none" />
  </svg>
);
const IconNecklace = ({ color = "#C9A84C" }: { color?: string }) => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 10 Q6 4 20 4 Q34 4 34 10" stroke={color} strokeWidth="1.6" strokeLinecap="round" fill="none" />
    <path d="M6 10 Q4 20 8 28 Q12 34 20 34 Q28 34 32 28 Q36 20 34 10" stroke={color} strokeWidth="1.6" fill="none" />
    <polygon points="20,28 17,33 20,36 23,33" stroke={color} strokeWidth="1.4" fill="none" strokeLinejoin="round" />
    <circle cx="20" cy="22" r="1.5" fill={color} />
    <circle cx="14" cy="29" r="1" fill={color} opacity="0.6" />
    <circle cx="26" cy="29" r="1" fill={color} opacity="0.6" />
  </svg>
);
const IconRing = ({ color = "#C9A84C" }: { color?: string }) => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="20" cy="26" rx="12" ry="7" stroke={color} strokeWidth="1.6" fill="none" />
    <ellipse cx="20" cy="21" rx="12" ry="7" stroke={color} strokeWidth="1.6" fill="none" />
    <line x1="8" y1="21" x2="8" y2="26" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
    <line x1="32" y1="21" x2="32" y2="26" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
    <polygon points="20,8 17,14 20,16 23,14" stroke={color} strokeWidth="1.4" fill="none" strokeLinejoin="round" />
    <line x1="20" y1="14" x2="20" y2="19" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);
const IconBracelet = ({ color = "#C9A84C" }: { color?: string }) => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 20 Q8 10 20 10 Q32 10 32 20 Q32 30 20 30 Q8 30 8 20" stroke={color} strokeWidth="1.6" fill="none" strokeDasharray="3.5 2.5" strokeLinecap="round" />
    <circle cx="20" cy="10" r="2.5" stroke={color} strokeWidth="1.4" fill="none" />
    <line x1="20" y1="7.5" x2="20" y2="5" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
    <circle cx="20" cy="30" r="2.5" stroke={color} strokeWidth="1.4" fill="none" />
    <circle cx="8" cy="20" r="1.8" stroke={color} strokeWidth="1.4" fill="none" />
    <circle cx="32" cy="20" r="1.8" stroke={color} strokeWidth="1.4" fill="none" />
  </svg>
);
const IconBangle = ({ color = "#C9A84C" }: { color?: string }) => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="20" cy="22" r="14" stroke={color} strokeWidth="2" fill="none" />
    <circle cx="20" cy="22" r="9" stroke={color} strokeWidth="1.2" fill="none" opacity="0.4" />
    <circle cx="20" cy="8" r="2.2" fill={color} opacity="0.8" />
    <circle cx="20" cy="36" r="2.2" fill={color} opacity="0.8" />
    <circle cx="6" cy="22" r="2.2" fill={color} opacity="0.8" />
    <circle cx="34" cy="22" r="2.2" fill={color} opacity="0.8" />
  </svg>
);
const IconJewelrySet = ({ color = "#C9A84C" }: { color?: string }) => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 28 L8 18 L14 23 L20 14 L26 23 L32 18 L32 28 Z" stroke={color} strokeWidth="1.6" fill="none" strokeLinejoin="round" />
    <line x1="8" y1="28" x2="32" y2="28" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
    <circle cx="20" cy="14" r="2" fill={color} opacity="0.9" />
    <circle cx="8" cy="18" r="1.5" stroke={color} strokeWidth="1.2" fill="none" />
    <circle cx="32" cy="18" r="1.5" stroke={color} strokeWidth="1.2" fill="none" />
    <circle cx="20" cy="32" r="1.4" fill={color} opacity="0.5" />
  </svg>
);

/* shared label style */
const eyebrow: React.CSSProperties = {
  fontFamily: "'DM Sans', sans-serif",
  fontSize: "0.72rem",
  letterSpacing: "0.25em",
  color: "var(--rose-gold)",
  textTransform: "uppercase",
  fontWeight: 500,
};
const heading: React.CSSProperties = {
  fontFamily: "'Playfair Display', serif",
  fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
  fontWeight: 600,
  color: "var(--foreground)",
};

const iconMap: Record<string, React.ComponentType<{ color?: string }>> = {
  "Earrings": IconEarrings,
  "Necklaces": IconNecklace,
  "Rings": IconRing,
  "Bracelets": IconBracelet,
  "Bangles": IconBangle,
  "Sets": IconJewelrySet,
  "Jewelry Sets": IconJewelrySet,
};

interface FeaturedCategoriesProps {
  categoriesData?: Array<{
    id: number;
    name: string;
    slug: string;
    image: string;
    icon_svg: string;
    product_count_label: string;
  }>;
}

export function FeaturedCategories({ categoriesData }: FeaturedCategoriesProps) {
  const cats = categoriesData
    ? categoriesData.map((c) => ({
        label: c.name,
        Icon: iconMap[c.name] || IconRing,
        count: c.product_count_label,
      }))
    : [];

  return (
    <section className="py-20 md:py-24" style={{ background: "#080600" }}>
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-12">
          <p style={eyebrow}>✦ Shop By Category ✦</p>
          <h2 className="mt-3" style={heading}>Find Your Perfect Piece</h2>
        </div>
        {cats.length === 0 ? (
          <div className="text-center py-10 text-gray-500 font-serif">No categories found</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {cats.map(({ label, Icon, count }) => (
              <Link
                key={label}
                to={`/products?category=${encodeURIComponent(label)}`}
                style={{ textDecoration: "none", display: "block" }}
              >
                <motion.div
                  whileHover={{ y: -6, scale: 1.05, boxShadow: "0 20px 48px rgba(201,168,76,0.25)" }}
                  transition={{ duration: 0.22, ease: "easeOut" }}
                  className="flex flex-col items-center gap-4 p-6 rounded-3xl cursor-pointer"
                  style={{
                    background: "linear-gradient(135deg, #13100A, #1A1500)",
                    border: "1px solid rgba(201,168,76,0.2)",
                    boxShadow: "0 2px 16px rgba(0,0,0,0.4)",
                  }}
                >
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center"
                    style={{ background: "rgba(201,168,76,0.12)", border: "1px solid rgba(201,168,76,0.2)" }}
                  >
                    <Icon color="#C9A84C" />
                  </div>
                  <div className="text-center">
                    <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "0.95rem", fontWeight: 600, color: "var(--foreground)" }}>{label}</p>
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.7rem", color: "var(--muted-foreground)", marginTop: "2px" }}>{count}</p>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

interface DynamicSectionsProps extends SectionsProps {
  products?: Product[];
  loading?: boolean;
}

/* ────────── BESTSELLERS ────────── */
export function BestSellers({ products, loading, onAddToCart, onQuickView }: DynamicSectionsProps) {
  const displayProducts = products || [];

  return (
    <section id="bestsellers" className="py-20 md:py-24" style={{ background: "#060400" }}>
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p style={eyebrow}>✦ Customer Favourites ✦</p>
            <h2 className="mt-2" style={heading}>Best Selling Jewelry</h2>
          </div>
          <Link
            to="/products"
            className="hidden md:flex items-center gap-2 transition-opacity hover:opacity-70"
            style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.85rem", color: "var(--rose-gold)", fontWeight: 500, textDecoration: "none" }}
          >
            View All <ArrowRight size={16} />
          </Link>
        </div>
        {loading ? (
          <div className="text-center py-10 text-gray-500 font-serif">Loading products...</div>
        ) : displayProducts.length === 0 ? (
          <div className="text-center py-10 text-gray-500 font-serif">No products found</div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {displayProducts.map((p) => (
              <ProductCard key={p.id} product={p} onAddToCart={onAddToCart} onQuickView={onQuickView} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* ────────── NEW ARRIVALS ────────── */
export function NewArrivals({ products, loading, onAddToCart, onQuickView }: DynamicSectionsProps) {
  const displayProducts = products || [];

  return (
    <section id="new-arrivals" className="py-20 md:py-24" style={{ background: "#080600" }}>
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p style={eyebrow}>✦ Just Dropped ✦</p>
            <h2 className="mt-2" style={heading}>New Arrivals</h2>
          </div>
          <Link
            to="/products?filter=new"
            className="hidden md:flex items-center gap-2 transition-opacity hover:opacity-70"
            style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.85rem", color: "var(--rose-gold)", fontWeight: 500, textDecoration: "none" }}
          >
            View All <ArrowRight size={16} />
          </Link>
        </div>
        {loading ? (
          <div className="text-center py-10 text-gray-500 font-serif">Loading products...</div>
        ) : displayProducts.length === 0 ? (
          <div className="text-center py-10 text-gray-500 font-serif">No products found</div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {displayProducts.map((p) => (
              <ProductCard key={p.id} product={p} onAddToCart={onAddToCart} onQuickView={onQuickView} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* ────────── LIMITED OFFER BANNER ────────── */
export function OfferBanner({ offerData }: { offerData?: any }) {
  const title = offerData?.title || "Up to 40% Off";
  const subtitle = offerData?.subtitle || "On Bridal Collections";
  const description = offerData?.description || "Use code BRIDE40 at checkout. Limited period offer only.";
  const code = offerData?.code || "BRIDE40";
  const hours = offerData?.hours || "11";
  const mins = offerData?.mins || "47";
  const secs = offerData?.secs || "32";

  return (
    <section id="sale" className="py-16 md:py-20" style={{ background: "linear-gradient(135deg, #13100A 0%, #1A1500 50%, #13100A 100%)", borderTop: "1px solid rgba(201,168,76,0.2)", borderBottom: "1px solid rgba(201,168,76,0.2)" }}>
      <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
        <p style={eyebrow}>✦ Flash Sale ✦</p>
        <h2 className="mt-4 mb-3" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 600, color: "#fff", lineHeight: 1.1 }}>
          {title}<br /><em style={{ color: "#C9A84C" }}>{subtitle}</em>
        </h2>
        <p className="mb-8" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "1rem", color: "rgba(255,255,255,0.6)", fontWeight: 300 }}>
          Use code <strong style={{ color: "#E0C87A" }}>{code}</strong> at checkout. Limited period offer only.
        </p>
        <div className="flex items-center justify-center gap-4 mb-8">
          {[{ val: hours, label: "Hours" }, { val: mins, label: "Mins" }, { val: secs, label: "Secs" }].map((t, i) => (
            <div key={t.label} className="flex items-center gap-4">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: "rgba(201,168,76,0.15)", border: "1px solid rgba(201,168,76,0.3)", backdropFilter: "blur(8px)" }}>
                  <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", fontWeight: 700, color: "#fff" }}>{t.val}</span>
                </div>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.62rem", letterSpacing: "0.15em", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", marginTop: "6px" }}>{t.label}</span>
              </div>
              {i < 2 && <span style={{ fontSize: "1.5rem", color: "rgba(201,168,76,0.5)", fontWeight: 300 }}>:</span>}
            </div>
          ))}
        </div>
        <Link
          to="/products?filter=sale"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-full transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
          style={{ background: "linear-gradient(135deg, #E0C87A, #C9A84C)", color: "#fff", fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontSize: "0.9rem", letterSpacing: "0.08em", textDecoration: "none" }}
        >
          Shop The Sale <ArrowRight size={18} />
        </Link>
      </div>
    </section>
  );
}

/* ────────── WHY CHOOSE US ────────── */
export function WhyChooseUs() {
  const features = [
    { icon: Shield, title: "100% Authentic", desc: "Every piece is quality-certified and crafted with premium materials that last." },
    { icon: Truck, title: "Free Shipping", desc: "Complimentary delivery on all orders above Rs. 5,000 across Pakistan." },
    { icon: RefreshCw, title: "Easy Returns", desc: "30-day hassle-free returns. Shop with complete confidence and peace of mind." },
    { icon: HeadphonesIcon, title: "24/7 Support", desc: "Our dedicated team is always here to help you find your perfect piece." },
  ];
  return (
    <section id="about" className="py-20 md:py-28" style={{ background: "#060400" }}>
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-14">
          <p style={eyebrow}>✦ The {BRAND_NAME} Promise ✦</p>
          <h2 className="mt-3" style={heading}>Why Choose {BRAND_NAME}?</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map(({ icon: Icon, title, desc }) => (
            <motion.div
              key={title}
              whileHover={{ y: -6 }}
              className="flex flex-col items-center text-center gap-4 p-8 rounded-3xl"
              style={{ background: "linear-gradient(135deg, #13100A, #1A1500)", border: "1px solid rgba(201,168,76,0.18)", boxShadow: "0 4px 24px rgba(0,0,0,0.4)" }}
            >
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #C9A84C, #8B6914)" }}>
                <Icon size={22} color="#fff" />
              </div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", fontWeight: 600, color: "var(--foreground)" }}>{title}</h3>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.875rem", color: "var(--muted-foreground)", lineHeight: 1.65, fontWeight: 300 }}>{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ────────── TESTIMONIALS ────────── */
export function Testimonials({ testimonialsData }: { testimonialsData?: any[] }) {
  const displayReviews = testimonialsData || [];

  return (
    <section className="py-20 md:py-28" style={{ background: "#080600" }}>
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-14">
          <p style={eyebrow}>✦ Real Reviews ✦</p>
          <h2 className="mt-3" style={heading}>What Our Customers Say</h2>
        </div>
        {displayReviews.length === 0 ? (
          <div className="text-center py-10 text-gray-500 font-serif">No reviews yet</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {displayReviews.map((r, i) => (
              <motion.div
                key={r.name + i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="flex flex-col gap-4 p-6 rounded-3xl"
                style={{ background: "#0F0D04", border: "1px solid rgba(201,168,76,0.15)", boxShadow: "0 4px 24px rgba(0,0,0,0.4)" }}
              >
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: r.rating }).map((_, j) => (
                    <Star key={j} size={13} fill="#C9A84C" stroke="#C9A84C" />
                  ))}
                </div>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.875rem", color: "rgba(240,232,233,0.75)", lineHeight: 1.7, fontStyle: "italic", fontWeight: 300 }}>
                  "{r.text}"
                </p>
                <div className="flex items-center gap-3 mt-auto pt-3 border-t" style={{ borderColor: "rgba(201,168,76,0.12)" }}>
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-white shrink-0" style={{ background: "linear-gradient(135deg, #C9A84C, #8B6914)", fontFamily: "'DM Sans', sans-serif", fontSize: "0.72rem", fontWeight: 600 }}>
                    {r.avatar || r.avatar_initials || r.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.85rem", fontWeight: 600, color: "var(--foreground)" }}>{r.name}</p>
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.7rem", color: "var(--rose-gold)" }}>{r.product || r.product_name}</p>
                  </div>
                  <CheckCircle2 size={15} style={{ color: "var(--rose-gold)", marginLeft: "auto" }} />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* ────────── INSTAGRAM GALLERY ────────── */
const igImages = [
  "https://images.unsplash.com/photo-1702476320482-0736c4b962f5?w=300&h=300&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1632525231035-c054cd5019db?w=300&h=300&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1777126413365-f4113a23eeab?w=300&h=300&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1723726871280-ab921c7e60c0?w=300&h=300&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1633934542430-0905ccb5f050?w=300&h=300&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1513122991877-4a5678e6d72f?w=300&h=300&fit=crop&auto=format",
];

export function InstagramGallery({ handle }: { handle?: string }) {
  const displayHandle = handle || BRAND_INSTAGRAM_HANDLE;

  return (
    <section className="py-20 md:py-24" style={{ background: "#060400" }}>
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-12">
          <p style={eyebrow}>✦ {displayHandle} ✦</p>
          <h2 className="mt-3" style={heading}>Follow Us on Instagram</h2>
          <p className="mt-2" style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--muted-foreground)", fontSize: "0.9rem" }}>Tag {BRAND_HASHTAG} to be featured</p>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-3">
          {igImages.map((img, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.04 }}
              className="aspect-square rounded-2xl overflow-hidden relative group cursor-pointer"
              style={{ border: "1px solid rgba(201,168,76,0.15)" }}
            >
              <img src={img} alt="Instagram gallery" className="w-full h-full object-cover" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: "rgba(201,168,76,0.55)" }}>
                <Instagram size={24} color="#fff" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ────────── NEWSLETTER ────────── */
export function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) { setSubmitted(true); setEmail(""); }
  };

  return (
    <section className="py-20 md:py-24" style={{ background: "linear-gradient(135deg, #13100A 0%, #080600 50%, #13100A 100%)", borderTop: "1px solid rgba(201,168,76,0.15)" }}>
      <div className="max-w-2xl mx-auto px-4 md:px-8 text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-6" style={{ background: "linear-gradient(135deg, #C9A84C, #8B6914)" }}>
          <Mail size={22} color="#fff" />
        </div>
        <p style={eyebrow}>✦ Stay In The Loop ✦</p>
        <h2 className="mt-3 mb-3" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem, 3.5vw, 2.5rem)", fontWeight: 600, color: "var(--foreground)" }}>
          Join the {BRAND_NAME} Circle
        </h2>
        <p className="mb-8" style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--muted-foreground)", fontSize: "0.95rem", lineHeight: 1.65, fontWeight: 300 }}>
          Subscribe for early access to new collections, exclusive offers, styling tips, and a special 10% off your first order.
        </p>
        {submitted ? (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center justify-center gap-3 py-4 px-8 rounded-full" style={{ background: "linear-gradient(135deg, #C9A84C, #8B6914)", color: "#fff" }}>
            <CheckCircle2 size={20} />
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}>Welcome to the {BRAND_NAME} family!</span>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              className="flex-1 px-5 py-3.5 rounded-full outline-none"
              style={{ border: "1.5px solid rgba(201,168,76,0.3)", background: "rgba(255,255,255,0.05)", fontFamily: "'DM Sans', sans-serif", fontSize: "0.9rem", color: "var(--foreground)" }}
            />
            <button type="submit" className="px-7 py-3.5 rounded-full text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg whitespace-nowrap" style={{ background: "linear-gradient(135deg, #C9A84C, #8B6914)", fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontSize: "0.9rem", border: "none", cursor: "pointer" }}>
              Subscribe
            </button>
          </form>
        )}
        <p className="mt-4" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.75rem", color: "var(--muted-foreground)" }}>No spam, ever. Unsubscribe anytime.</p>
      </div>
    </section>
  );
}

/* ────────── FOOTER ────────── */
export function Footer() {
  const links = {
    Shop: ["New Arrivals", "Best Sellers", "Earrings", "Necklaces", "Rings", "Bracelets"],
    Help: ["Shipping Info", "Returns", "Size Guide", "Care Instructions", "FAQ"],
    Company: ["About Us", "Our Story", "Careers", "Press", "Sustainability"],
  };
  return (
    <footer style={{ background: "#040300", borderTop: "1px solid rgba(201,168,76,0.15)" }}>
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2">
            <BrandLogo
              className="mb-5"
              imageClassName="h-16 w-auto object-contain"
              titleClassName="text-[1.1rem] font-semibold tracking-[0.18em] text-[var(--rose-gold)]"
              taglineClassName="mt-1 text-[0.6rem] tracking-[0.35em] uppercase text-[rgba(255,255,255,0.3)]"
            />
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.875rem", color: "rgba(255,255,255,0.4)", lineHeight: 1.75, fontWeight: 300, maxWidth: "280px" }}>
              Handcrafted artificial jewelry that celebrates your elegance. Premium designs, affordable luxury.
            </p>
            <div className="flex items-center gap-3 mt-6">
              {[
                <svg key="fb" width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>,
                <svg key="ig" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>,
                <svg key="tw" width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></svg>,
                <svg key="yt" width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon fill="#040300" points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/></svg>,
              ].map((icon, i) => (
                <button key={i} className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110" style={{ background: "rgba(201,168,76,0.12)", border: "1px solid rgba(201,168,76,0.2)", color: "rgba(255,255,255,0.6)" }}>
                  {icon}
                </button>
              ))}
            </div>
          </div>
          {Object.entries(links).map(([section, items]) => (
            <div key={section}>
              <h4 className="mb-5" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.72rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--rose-gold)", fontWeight: 500 }}>{section}</h4>
              <ul className="flex flex-col gap-3">
                {items.map((item) => (
                  <li key={item}>
                    <a href="#" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.875rem", color: "rgba(255,255,255,0.38)", fontWeight: 300, textDecoration: "none" }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.7)")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.38)")}
                    >{item}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-14 pt-8 flex flex-col md:flex-row items-center justify-between gap-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.78rem", color: "rgba(255,255,255,0.25)" }}>© 2025 {BRAND_NAME}. All rights reserved.</p>
          <div className="flex items-center gap-5">
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((link) => (
              <a key={link} href="#" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.75rem", color: "rgba(255,255,255,0.25)", textDecoration: "none" }}>{link}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
