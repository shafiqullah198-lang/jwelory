import { X, ShoppingBag, Trash2, ArrowRight, Minus, Plus } from "lucide-react";
import { formatCurrency } from "../utils";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router";
import { useAuth } from "./AuthContext";
import type { Product } from "./ProductCard";

interface CartItem extends Product {
  qty: number;
}

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemove: (id: number) => void;
  onUpdateQty: (id: number, qty: number) => void;
}

export function CartDrawer({ open, onClose, items, onRemove, onUpdateQty }: CartDrawerProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const count = items.reduce((sum, item) => sum + item.qty, 0);

  const handleCheckout = () => {
    onClose();
    if (user) {
      navigate("/checkout");
    } else {
      navigate("/login?next=/checkout");
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150]"
            style={{ background: "rgba(43,43,43,0.4)", backdropFilter: "blur(4px)" }}
            onClick={onClose}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.32, ease: [0.32, 0.72, 0, 1] }}
            className="fixed right-0 top-0 bottom-0 z-[151] w-full max-w-md flex flex-col shadow-2xl"
            style={{ background: "#080600" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b" style={{ borderColor: "rgba(201,168,76,0.18)" }}>
              <div className="flex items-center gap-2">
                <ShoppingBag size={20} style={{ color: "var(--rose-gold)" }} />
                <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", fontWeight: 600, color: "var(--foreground)" }}>
                  Your Bag ({count})
                </span>
              </div>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-secondary transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                  <ShoppingBag size={48} style={{ color: "var(--accent)" }} />
                  <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", color: "var(--muted-foreground)" }}>
                    Your bag is empty
                  </p>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.875rem", color: "var(--muted-foreground)", fontWeight: 300 }}>
                    Add some beautiful jewelry to get started
                  </p>
                  <button
                    onClick={onClose}
                    className="mt-2 px-6 py-3 rounded-full text-white"
                    style={{ background: "var(--rose-gold)", fontFamily: "'DM Sans', sans-serif", fontWeight: 500, border: "none", cursor: "pointer" }}
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4 p-3 rounded-2xl" style={{ background: "#13100A", border: "1px solid rgba(201,168,76,0.15)" }}>
                      <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0" style={{ background: "#fff" }}>
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 flex flex-col gap-1">
                        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.65rem", letterSpacing: "0.12em", color: "var(--rose-gold)", textTransform: "uppercase" }}>{item.category}</p>
                        <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "0.9rem", fontWeight: 500, color: "var(--foreground)", lineHeight: 1.3 }}>{item.name}</p>
                        <div className="flex items-center justify-between mt-auto">
                          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", fontWeight: 700, color: "var(--rose-gold)" }}>
                            {formatCurrency(item.price * item.qty)}
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => onUpdateQty(item.id, item.qty - 1)}
                              className="w-5 h-5 rounded-full flex items-center justify-center text-white border border-[#C9A84C]/35 hover:bg-[#C9A84C]/10 transition-colors"
                            >
                              <Minus size={10} />
                            </button>
                            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.78rem", color: "var(--foreground)", minWidth: "12px", textAlign: "center" }}>{item.qty}</span>
                            <button
                              onClick={() => onUpdateQty(item.id, item.qty + 1)}
                              className="w-5 h-5 rounded-full flex items-center justify-center text-white border border-[#C9A84C]/35 hover:bg-[#C9A84C]/10 transition-colors"
                            >
                              <Plus size={10} />
                            </button>
                            <button onClick={() => onRemove(item.id)} className="p-1 rounded-full hover:bg-white/5 transition-colors ml-1">
                              <Trash2 size={13} style={{ color: "#d4183d" }} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-6 py-5 border-t" style={{ borderColor: "rgba(201,168,76,0.18)", background: "#080600" }}>
                <div className="flex items-center justify-between mb-4">
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.9rem", color: "var(--muted-foreground)" }}>Subtotal</span>
                  <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", fontWeight: 700, color: "var(--rose-gold)" }}>
                    {formatCurrency(total)}
                  </span>
                </div>
                <p className="mb-4 text-center" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.78rem", color: "var(--rose-gold)" }}>
                  🎉 Free shipping on this order!
                </p>
                <button
                  onClick={handleCheckout}
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-full text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                  style={{
                    background: "linear-gradient(135deg, var(--rose-gold), #8B6914)",
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 500,
                    fontSize: "1rem",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Proceed to Checkout <ArrowRight size={18} />
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}