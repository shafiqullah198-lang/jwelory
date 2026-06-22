import React, { useEffect, useState } from "react";
import { formatCurrency } from "../utils";
import { useParams, Link } from "react-router";
import { apiFetch } from "../api";
import { ProductCard, type Product } from "../components/ProductCard";
import { Star, Shield, Truck, RefreshCw, ShoppingBag, Plus, Minus, Loader2 } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

interface ProductDetailData extends Product {
  description: string;
  images: Array<{ id: number; image: string; is_primary: boolean }>;
}

interface ProductDetailProps {
  onAddToCart: (product: Product) => void;
  onQuickView: (product: Product) => void;
}

export default function ProductDetail({ onAddToCart, onQuickView }: ProductDetailProps) {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<ProductDetailData | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState("");
  const [added, setAdded] = useState(false);

  useEffect(() => {
    async function loadDetail() {
      if (!slug) return;
      setLoading(true);
      setQuantity(1);
      try {
        const data = await apiFetch(`products/${slug}/`);
        if (data) {
          const p = data.product;
          const mappedProduct: ProductDetailData = {
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
            description: p.description || "",
            images: p.images || [],
          };
          setProduct(mappedProduct);
          setActiveImage(mappedProduct.image);

          if (data.related_products) {
            const mappedRelated = data.related_products.map((r: any) => ({
              id: r.id,
              name: r.name,
              slug: r.slug,
              category: r.category,
              price: r.currentPrice,
              originalPrice: r.price,
              rating: r.rating,
              reviewCount: r.reviewCount,
              image: r.image,
              isNew: r.isNew,
              isTrending: r.isTrending,
              inStock: r.inStock,
            }));
            setRelated(mappedRelated);
          }
        }
      } catch (err) {
        console.error("Failed to load product detail:", err);
      } finally {
        setLoading(false);
      }
    }
    loadDetail();
  }, [slug]);

  const handleQtyChange = (val: number) => {
    if (!product) return;
    const newQty = quantity + val;
    if (newQty >= 1 && newQty <= product.stock) {
      setQuantity(newQty);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    for (let i = 0; i < quantity; i++) {
      onAddToCart(product);
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#060400" }}>
        <Loader2 className="animate-spin text-rose-gold" size={32} style={{ color: "var(--rose-gold)" }} />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4" style={{ background: "#060400" }}>
        <h2 className="text-2xl font-bold mb-4" style={{ color: "#F0E8D0" }}>Jewelry Item Not Found</h2>
        <Link to="/products" className="px-6 py-3 rounded-full text-white font-medium" style={{ background: "var(--rose-gold)" }}>Browse Shop</Link>
      </div>
    );
  }

  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  return (
    <div className="min-h-screen py-16 md:py-24" style={{ background: "#080600" }}>
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Main Product Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 mb-20">
          {/* Images Column */}
          <div className="space-y-4">
            <div
              className="aspect-[3/4] w-full rounded-3xl overflow-hidden relative"
              style={{ background: "#0a0800", border: "1px solid rgba(201,168,76,0.18)" }}
            >
              <ImageWithFallback src={activeImage} alt={product.name} className="w-full h-full object-cover" />
              {discount > 0 && (
                <span
                  className="absolute top-4 left-4 px-3 py-1 rounded-full text-black font-bold text-xs"
                  style={{ background: "linear-gradient(135deg, var(--rose-gold), #E0C87A)" }}
                >
                  -{discount}% OFF
                </span>
              )}
            </div>

            {/* Thumbnails */}
            {product.images.length > 0 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {/* Include primary image */}
                <button
                  onClick={() => setActiveImage(product.image)}
                  className="w-20 h-20 rounded-xl overflow-hidden shrink-0 transition-all border"
                  style={{
                    borderColor: activeImage === product.image ? "var(--rose-gold)" : "transparent",
                    background: "rgba(0,0,0,0.2)",
                  }}
                >
                  <ImageWithFallback src={product.image} alt="thumbnail main" className="w-full h-full object-cover" />
                </button>
                {product.images.map((img) => (
                  <button
                    key={img.id}
                    onClick={() => setActiveImage(img.image)}
                    className="w-20 h-20 rounded-xl overflow-hidden shrink-0 transition-all border"
                    style={{
                      borderColor: activeImage === img.image ? "var(--rose-gold)" : "transparent",
                      background: "rgba(0,0,0,0.2)",
                    }}
                  >
                    <ImageWithFallback src={img.image} alt="thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Column */}
          <div className="flex flex-col justify-center space-y-6">
            <div>
              <p className="text-xs uppercase tracking-widest font-semibold" style={{ color: "var(--rose-gold)" }}>{product.category}</p>
              <h1 className="text-3xl md:text-4xl font-bold mt-2" style={{ fontFamily: "'Playfair Display', serif", color: "#F0E8D0" }}>{product.name}</h1>

              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={15}
                      fill={i < Math.floor(product.rating) ? "var(--rose-gold)" : "transparent"}
                      stroke="var(--rose-gold)"
                    />
                  ))}
                  <span className="text-xs font-semibold ml-1.5" style={{ color: "var(--foreground)" }}>{product.rating}</span>
                </div>
                <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>({product.reviewCount} customer reviews)</span>
              </div>
            </div>

            {/* Prices */}
            <div className="flex items-baseline gap-4">
              <span className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>{formatCurrency(product.price)}</span>
              {discount > 0 && (
                <span className="text-base line-through" style={{ color: "var(--muted-foreground)" }}>{formatCurrency(product.originalPrice)}</span>
              )}
            </div>

            <div className="border-t" style={{ borderColor: "rgba(201,168,76,0.12)" }} />

            {/* Description */}
            <p className="text-sm leading-relaxed" style={{ color: "rgba(240,232,208,0.75)", fontWeight: 300 }}>
              {product.description}
            </p>

            {/* Quantity Selector & Add to Cart */}
            {product.inStock ? (
              <div className="space-y-4">
                <p className="text-xs font-semibold" style={{ color: "var(--rose-gold)" }}>
                  In Stock ({product.stock} items remaining)
                </p>

                <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
                  <div
                    className="flex items-center justify-between rounded-full px-4 py-2 sm:w-32"
                    style={{ border: "1px solid rgba(201,168,76,0.35)", background: "rgba(255,255,255,0.02)" }}
                  >
                    <button onClick={() => handleQtyChange(-1)} disabled={quantity <= 1} className="p-1 disabled:opacity-30">
                      <Minus size={16} style={{ color: "var(--rose-gold)" }} />
                    </button>
                    <span className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>{quantity}</span>
                    <button onClick={() => handleQtyChange(1)} disabled={quantity >= product.stock} className="p-1 disabled:opacity-30">
                      <Plus size={16} style={{ color: "var(--rose-gold)" }} />
                    </button>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    className="flex-1 flex items-center justify-center gap-2 px-8 py-3.5 rounded-full font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                    style={{ background: "var(--primary-cta-background)", color: "var(--primary-foreground)" }}
                  >
                    <ShoppingBag size={18} />
                    <span>{added ? "Added ✓" : "Add to Cart"}</span>
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-lg font-semibold" style={{ color: "var(--destructive)" }}>
                Out of Stock
              </p>
            )}

            <div className="border-t pt-6" style={{ borderColor: "rgba(201,168,76,0.12)" }} />

            {/* Promise icons */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="flex flex-col items-center">
                <Shield size={18} style={{ color: "var(--rose-gold)" }} />
                <span className="text-[10px] uppercase font-semibold mt-2" style={{ color: "var(--foreground)" }}>Quality Certified</span>
              </div>
              <div className="flex flex-col items-center">
                <Truck size={18} style={{ color: "var(--rose-gold)" }} />
                <span className="text-[10px] uppercase font-semibold mt-2" style={{ color: "var(--foreground)" }}>Free Shipping</span>
              </div>
              <div className="flex flex-col items-center">
                <RefreshCw size={18} style={{ color: "var(--rose-gold)" }} />
                <span className="text-[10px] uppercase font-semibold mt-2" style={{ color: "var(--foreground)" }}>Easy Returns</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="border-t pt-16" style={{ borderColor: "rgba(201,168,76,0.12)" }}>
            <h2
              className="text-2xl font-bold mb-10 text-center"
              style={{ fontFamily: "'Playfair Display', serif", color: "#F0E8D0" }}
            >
              You May Also Like
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} onAddToCart={onAddToCart} onQuickView={onQuickView} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
