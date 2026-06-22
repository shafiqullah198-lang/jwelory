import React from "react";
import { formatCurrency } from "../utils";
import { Link } from "react-router";
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, Package } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

interface CartItem {
  id: number;
  product_id: number;
  name: string;
  slug: string;
  category: string;
  price: number;
  image: string;
  quantity: number;
  line_total: number;
  stock: number;
}

interface CartPageProps {
  items: CartItem[];
  subtotal: number;
  total: number;
  onRemove: (id: number) => void;
  onUpdateQty: (id: number, qty: number) => void;
}

export default function CartPage({ items, subtotal, total, onRemove, onUpdateQty }: CartPageProps) {
  const shippingThreshold = 5000;
  const shippingCost = subtotal >= shippingThreshold || subtotal === 0 ? 0 : 200;

  return (
    <div className="min-h-screen py-16 md:py-20" style={{ background: "#080600" }}>
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <h1 style={{ fontFamily: "'Playfair Display', serif", color: "#F0E8D0" }} className="text-3xl font-extrabold mb-10">Shopping Cart</h1>

        {items.length === 0 ? (
          <div
            className="text-center p-16 rounded-3xl"
            style={{
              background: "linear-gradient(135deg, #13100A, #1A1500)",
              border: "1px solid rgba(201, 168, 76, 0.15)",
            }}
          >
            <ShoppingBag size={48} style={{ color: "var(--rose-gold)" }} className="mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2" style={{ color: "#F0E8D0" }}>Your Cart is Empty</h2>
            <p className="text-sm mb-6" style={{ color: "var(--muted-foreground)" }}>Add items to your cart to see them here.</p>
            <Link
              to="/products"
              className="inline-block px-8 py-3 rounded-full font-semibold"
              style={{ background: "var(--primary-cta-background)", color: "var(--primary-foreground)" }}
            >
              Shop Jewelry
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items List */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-5 rounded-3xl"
                  style={{
                    background: "linear-gradient(135deg, #13100A, #1A1500)",
                    border: "1px solid rgba(201, 168, 76, 0.15)",
                  }}
                >
                  <div className="flex items-center gap-4">
                    {item.image ? (
                      <ImageWithFallback
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-2xl shrink-0"
                        style={{ border: "1px solid rgba(201,168,76,0.12)" }}
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center shrink-0">
                        <Package size={24} style={{ color: "var(--muted-foreground)" }} />
                      </div>
                    )}
                    <div>
                      <p className="text-xs uppercase tracking-wider font-semibold" style={{ color: "var(--rose-gold)" }}>{item.category}</p>
                      <Link to={`/products/${item.slug}`} className="font-bold text-sm hover:underline mt-1 block" style={{ color: "#F0E8D0" }}>
                        {item.name}
                      </Link>
                      <p className="text-sm mt-1" style={{ color: "var(--muted-foreground)" }}>{formatCurrency(item.price)}</p>
                    </div>
                  </div>

                  {/* Qty Selector & line total */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-none pt-4 sm:pt-0" style={{ borderColor: "rgba(201,168,76,0.1)" }}>
                    <div
                      className="flex items-center justify-between rounded-full px-3 py-1.5 w-28"
                      style={{ border: "1px solid rgba(201,168,76,0.3)", background: "rgba(255,255,255,0.02)" }}
                    >
                      <button onClick={() => onUpdateQty(item.id, item.quantity - 1)} className="p-0.5">
                        <Minus size={14} style={{ color: "var(--rose-gold)" }} />
                      </button>
                      <span className="text-xs font-semibold" style={{ color: "var(--foreground)" }}>{item.quantity}</span>
                      <button onClick={() => onUpdateQty(item.id, item.quantity + 1)} disabled={item.quantity >= item.stock} className="p-0.5 disabled:opacity-30">
                        <Plus size={14} style={{ color: "var(--rose-gold)" }} />
                      </button>
                    </div>

                    <div className="text-right sm:min-w-24">
                      <p className="text-sm font-semibold" style={{ color: "#F0E8D0" }}>{formatCurrency(item.line_total)}</p>
                    </div>

                    <button
                      onClick={() => onRemove(item.id)}
                      className="p-2 rounded-full hover:bg-white/5"
                      style={{ color: "var(--destructive)" }}
                      aria-label="Remove item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary Panel */}
            <div
              className="p-8 rounded-3xl h-fit space-y-6"
              style={{
                background: "linear-gradient(135deg, #13100A, #1A1500)",
                border: "1px solid rgba(201, 168, 76, 0.18)",
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.4)",
              }}
            >
              <h2 className="text-xl font-bold pb-2 border-b" style={{ color: "var(--rose-gold)", borderColor: "rgba(201,168,76,0.12)" }}>
                Order Summary
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between" style={{ color: "var(--muted-foreground)" }}>
                  <span>Subtotal:</span>
                  <span style={{ color: "var(--foreground)" }}>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between" style={{ color: "var(--muted-foreground)" }}>
                  <span>Shipping:</span>
                  <span style={{ color: "var(--foreground)" }}>{shippingCost === 0 ? "FREE" : formatCurrency(shippingCost)}</span>
                </div>
                {shippingCost > 0 && (
                  <p className="text-[10px]" style={{ color: "var(--rose-gold)" }}>
                    ✦ Add {formatCurrency(shippingThreshold - subtotal)} more for FREE shipping!
                  </p>
                )}
                <div className="border-t pt-3 flex justify-between font-bold text-base" style={{ color: "#F0E8D0", borderColor: "rgba(201,168,76,0.12)" }}>
                  <span>Total:</span>
                  <span>{formatCurrency(subtotal + shippingCost)}</span>
                </div>
              </div>

              <Link
                to="/checkout"
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg text-sm"
                style={{ background: "var(--primary-cta-background)", color: "var(--primary-foreground)" }}
              >
                <span>Proceed to Checkout</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
