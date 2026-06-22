import React from "react";
import { formatCurrency } from "../utils";
import { Link } from "react-router";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import type { Product } from "../components/ProductCard";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

interface WishlistPageProps {
  items: Product[];
  onRemove: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export default function WishlistPage({ items, onRemove, onAddToCart }: WishlistPageProps) {
  return (
    <div className="min-h-screen py-16 md:py-24" style={{ background: "#060400" }}>
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Page Header */}
        <div className="text-center mb-16">
          <p
            className="mb-3 text-xs tracking-[0.25em] uppercase font-semibold"
            style={{ color: "var(--rose-gold)" }}
          >
            ✦ Your Curated Treasures ✦
          </p>
          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: 600,
              color: "var(--foreground)",
            }}
          >
            My Wishlist
          </h1>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20 bg-white/3 rounded-3xl border border-white/5 max-w-md mx-auto">
            <Heart size={48} className="mx-auto mb-4 opacity-50" style={{ color: "var(--rose-gold)" }} />
            <p className="text-lg font-semibold mb-2" style={{ color: "#F0E8D0" }}>Your Wishlist is Empty</p>
            <p className="text-sm mb-8" style={{ color: "var(--muted-foreground)" }}>
              Add items to your wishlist to keep track of jewelry pieces you love.
            </p>
            <Link
              to="/products"
              className="inline-block px-8 py-3.5 rounded-full text-black font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
              style={{ background: "var(--primary-cta-background)" }}
            >
              Discover Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {items.map((product) => {
              const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
              return (
                <div
                  key={product.id}
                  className="group relative flex flex-col rounded-2xl overflow-hidden"
                  style={{
                    background: "#111009",
                    boxShadow: "0 4px 24px rgba(0,0,0,0.5)",
                    border: `1px solid rgba(201,168,76,0.14)`,
                  }}
                >
                  {/* Image */}
                  <div className="relative overflow-hidden" style={{ aspectRatio: "3/4", background: "#0a0800" }}>
                    <ImageWithFallback
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                    />
                    <div
                      className="absolute inset-0"
                      style={{
                        background: "linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 50%)",
                      }}
                    />

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1">
                      {discount > 0 && (
                        <span
                          className="px-2 py-0.5 rounded-full text-black text-[10px] font-bold"
                          style={{ background: "linear-gradient(135deg, var(--rose-gold), #E0C87A)" }}
                        >
                          -{discount}%
                        </span>
                      )}
                    </div>

                    {/* Delete button */}
                    <button
                      onClick={() => onRemove(product)}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center bg-black/60 hover:bg-red-950 transition-colors border border-white/10"
                      aria-label="Remove item"
                    >
                      <Trash2 size={13} className="text-red-500" />
                    </button>
                  </div>

                  {/* Info */}
                  <div className="flex flex-col gap-2 p-4 flex-grow">
                    <p className="text-[10px] tracking-widest uppercase" style={{ color: "var(--rose-gold)" }}>
                      {product.category}
                    </p>
                    <Link
                      to={`/products/${product.slug}`}
                      className="line-clamp-2 hover:opacity-80"
                      style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: "0.9rem",
                        fontWeight: 500,
                        color: "#F0E8D0",
                        textDecoration: "none",
                      }}
                    >
                      {product.name}
                    </Link>

                    {/* Price */}
                    <div className="flex items-center gap-2 mt-auto">
                      <span className="font-bold text-sm" style={{ color: "var(--rose-gold)" }}>
                        {formatCurrency(product.price)}
                      </span>
                      {product.originalPrice > product.price && (
                        <span className="line-through text-xs" style={{ color: "rgba(240,232,208,0.3)" }}>
                          {formatCurrency(product.originalPrice)}
                        </span>
                      )}
                    </div>

                    {/* Move to Cart */}
                    <button
                      onClick={() => {
                        onAddToCart(product);
                        onRemove(product);
                      }}
                      className="mt-3 w-full flex items-center justify-center gap-2 py-2 rounded-full text-xs font-semibold text-black transition-all duration-300 hover:shadow-md"
                      style={{
                        background: "var(--primary-cta-background)",
                        cursor: "pointer",
                      }}
                    >
                      <ShoppingBag size={12} />
                      Add to Bag
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
