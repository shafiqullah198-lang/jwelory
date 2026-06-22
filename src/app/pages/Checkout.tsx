import React, { useEffect, useState } from "react";
import { formatCurrency, PRIMARY_CTA_BACKGROUND } from "../utils";
import { apiFetch } from "../api";
import { useNavigate, Link } from "react-router";
import { CreditCard, ShoppingBag, MapPin, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

interface CheckoutItem {
  id: number;
  name: string;
  category: string;
  price: number;
  quantity: number;
  line_total: number;
  image: string;
}

interface CheckoutProps {
  onOrderSuccess: () => void; // Callback to reset cart state on App
}

const PAYMENT_METHODS = [
  {
    value: "cod",
    label: "Cash on Delivery",
    instructions: "Pay the courier in cash when your order is delivered.",
  },
  {
    value: "bank",
    label: "Bank Transfer",
    instructions: "Place the order first. Bank account details and your payment reference will be provided with the confirmation.",
  },
  {
    value: "jazzcash",
    label: "JazzCash",
    instructions: "Place the order first, then send the total through JazzCash using the payment details in your confirmation.",
  },
  {
    value: "easypaisa",
    label: "Easypaisa",
    instructions: "Place the order first, then send the total through Easypaisa using the payment details in your confirmation.",
  },
];

export default function Checkout({ onOrderSuccess }: CheckoutProps) {
  const navigate = useNavigate();
  const [items, setItems] = useState<CheckoutItem[]>([]);
  const [subtotal, setSubtotal] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    notes: "",
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [globalError, setGlobalError] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  useEffect(() => {
    async function loadCheckoutData() {
      try {
        const data = await apiFetch("orders/checkout/");
        if (data) {
          setItems(data.cart.items);
          setSubtotal(data.cart.subtotal);
          
          if (data.prefill) {
            setFormData({
              full_name: data.prefill.full_name || "",
              email: data.prefill.email || "",
              phone: data.prefill.phone || "",
              address: data.prefill.address || "",
              city: data.prefill.city || "",
              state: data.prefill.state || "",
              pincode: data.prefill.pincode || "",
              notes: "",
            });
          }
        }
      } catch (err: any) {
        console.error("Failed to load checkout details:", err);
        setGlobalError(err.message || "Failed to load checkout. Are you logged in?");
      } finally {
        setLoading(false);
      }
    }
    loadCheckoutData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[e.target.name];
        return copy;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setGlobalError("");
    setSubmitLoading(true);

    try {
      const payload = {
        ...formData,
        payment_method: paymentMethod,
      };
      const data = await apiFetch("orders/checkout/", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (data.success && data.order) {
        setOrderPlaced(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
        await Promise.resolve(onOrderSuccess());
        window.setTimeout(() => {
          navigate(`/order-success/${data.order.order_number}`, { replace: true });
        }, 650);
      } else {
        setGlobalError(data.message || "Checkout failed. Please check inputs.");
      }
    } catch (err: any) {
      if (err.data?.errors) {
        setErrors(err.data.errors);
      }
      if (err.message) {
        setGlobalError(err.message);
      } else {
        setGlobalError("Something went wrong during checkout.");
      }
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#080600" }}>
        <Loader2 className="animate-spin text-rose-gold" size={32} style={{ color: "var(--rose-gold)" }} />
      </div>
    );
  }

  if (globalError && items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4" style={{ background: "#080600" }}>
        <AlertCircle size={40} className="mb-4 text-destructive" />
        <h2 className="text-xl font-bold mb-2" style={{ color: "#F0E8D0" }}>Authentication Required</h2>
        <p className="text-sm mb-6" style={{ color: "var(--muted-foreground)" }}>Please log in to proceed to checkout.</p>
        <Link to="/login" className="px-6 py-3 rounded-full text-white font-medium" style={{ background: "var(--rose-gold)" }}>Sign In</Link>
      </div>
    );
  }

  const shippingCost = subtotal >= 5000 ? 0 : 200;
  const finalTotal = subtotal + shippingCost;

  return (
    <div className="min-h-screen py-16 md:py-20" style={{ background: "#080600" }}>
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <h1 style={{ fontFamily: "'Playfair Display', serif", color: "#F0E8D0" }} className="text-3xl font-extrabold mb-10">Checkout</h1>

        {globalError && (
          <div
            className="flex items-center gap-2 p-4 rounded-xl text-sm mb-6"
            style={{
              background: "rgba(212, 24, 61, 0.1)",
              border: "1px solid rgba(212, 24, 61, 0.3)",
              color: "var(--destructive)",
            }}
          >
            <AlertCircle size={18} className="shrink-0" />
            <span>{globalError}</span>
          </div>
        )}

        {orderPlaced && (
          <div
            className="flex items-center gap-2 p-4 rounded-xl text-sm mb-6"
            style={{
              background: "rgba(201, 168, 76, 0.1)",
              border: "1px solid rgba(201, 168, 76, 0.3)",
              color: "var(--rose-gold)",
            }}
          >
            <CheckCircle2 size={18} className="shrink-0" />
            <span>Information saved and order placed successfully. Opening your invoice…</span>
          </div>
        )}

        {Object.keys(errors).length > 0 && (
          <div
            className="p-4 rounded-xl text-sm mb-6"
            style={{
              background: "rgba(212, 24, 61, 0.1)",
              border: "1px solid rgba(212, 24, 61, 0.3)",
              color: "var(--destructive)",
            }}
          >
            {Object.values(errors).map((message) => <p key={message}>{message}</p>)}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Shipping Address Column */}
          <div
            className="lg:col-span-2 p-8 rounded-3xl space-y-6"
            style={{
              background: "linear-gradient(135deg, #13100A, #1A1500)",
              border: "1px solid rgba(201, 168, 76, 0.18)",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.4)",
            }}
          >
            <h2 className="text-xl font-bold pb-2 border-b flex items-center gap-2" style={{ color: "var(--rose-gold)", borderColor: "rgba(201,168,76,0.12)" }}>
              <MapPin size={18} /> Shipping Address
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs uppercase tracking-wider mb-2 font-semibold" style={{ color: "var(--rose-gold)" }}>Full Name</label>
                <input
                  type="text"
                  name="full_name"
                  required
                  value={formData.full_name}
                  onChange={handleChange}
                  className="block w-full px-4 py-2.5 rounded-full outline-none"
                  style={{ border: "1px solid rgba(201, 168, 76, 0.25)", background: "rgba(255, 255, 255, 0.04)", color: "var(--foreground)" }}
                  placeholder="Enter recipient's full name"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider mb-2 font-semibold" style={{ color: "var(--rose-gold)" }}>Email</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full px-4 py-2.5 rounded-full outline-none"
                  style={{ border: "1px solid rgba(201, 168, 76, 0.25)", background: "rgba(255, 255, 255, 0.04)", color: "var(--foreground)" }}
                  placeholder="Email address"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider mb-2 font-semibold" style={{ color: "var(--rose-gold)" }}>Phone</label>
                <input
                  type="text"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="block w-full px-4 py-2.5 rounded-full outline-none"
                  style={{ border: "1px solid rgba(201, 168, 76, 0.25)", background: "rgba(255, 255, 255, 0.04)", color: "var(--foreground)" }}
                  placeholder="Phone number"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs uppercase tracking-wider mb-2 font-semibold" style={{ color: "var(--rose-gold)" }}>Street Address</label>
                <textarea
                  name="address"
                  required
                  value={formData.address}
                  onChange={handleChange}
                  rows={3}
                  className="block w-full px-4 py-2.5 rounded-2xl outline-none resize-none"
                  style={{ border: "1px solid rgba(201, 168, 76, 0.25)", background: "rgba(255, 255, 255, 0.04)", color: "var(--foreground)" }}
                  placeholder="Apartment, suite, unit, building, street, etc."
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider mb-2 font-semibold" style={{ color: "var(--rose-gold)" }}>City</label>
                <input
                  type="text"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleChange}
                  className="block w-full px-4 py-2.5 rounded-full outline-none"
                  style={{ border: "1px solid rgba(201, 168, 76, 0.25)", background: "rgba(255, 255, 255, 0.04)", color: "var(--foreground)" }}
                  placeholder="City"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider mb-2 font-semibold" style={{ color: "var(--rose-gold)" }}>Province</label>
                <select
                  name="state"
                  required
                  value={formData.state}
                  onChange={(e) => {
                    setFormData({ ...formData, state: e.target.value });
                    if (errors.state) {
                      setErrors((prev) => {
                        const copy = { ...prev };
                        delete copy.state;
                        return copy;
                      });
                    }
                  }}
                  className="block w-full px-4 py-2.5 rounded-full outline-none"
                  style={{ border: "1px solid rgba(201, 168, 76, 0.25)", background: "rgba(22, 19, 13, 0.98)", color: "var(--foreground)" }}
                >
                  <option value="">Select Province</option>
                  <option value="Punjab">Punjab</option>
                  <option value="Sindh">Sindh</option>
                  <option value="KPK">KPK</option>
                  <option value="Balochistan">Balochistan</option>
                  <option value="Islamabad">Islamabad</option>
                  <option value="Gilgit Baltistan">Gilgit Baltistan</option>
                  <option value="Azad Kashmir">Azad Kashmir</option>
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider mb-2 font-semibold" style={{ color: "var(--rose-gold)" }}>Postal Code (Optional)</label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  className="block w-full px-4 py-2.5 rounded-full outline-none"
                  style={{ border: "1px solid rgba(201, 168, 76, 0.25)", background: "rgba(255, 255, 255, 0.04)", color: "var(--foreground)" }}
                  placeholder="Postal code"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs uppercase tracking-wider mb-2 font-semibold" style={{ color: "var(--rose-gold)" }}>Payment Method</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {PAYMENT_METHODS.map((method) => (
                    <label
                      key={method.value}
                      className="flex items-center gap-3 px-5 py-3 rounded-full cursor-pointer transition-all border"
                      style={{
                        background: paymentMethod === method.value ? "rgba(201, 168, 76, 0.12)" : "rgba(255, 255, 255, 0.02)",
                        borderColor: paymentMethod === method.value ? "var(--rose-gold)" : "rgba(201, 168, 76, 0.2)",
                      }}
                    >
                      <input
                        type="radio"
                        name="payment_method"
                        checked={paymentMethod === method.value}
                        onChange={() => setPaymentMethod(method.value)}
                        className="accent-[#C9A84C]"
                      />
                      <span className="text-xs font-semibold text-white">{method.label}</span>
                    </label>
                  ))}
                </div>
                <p
                  className="mt-3 px-4 py-3 rounded-2xl text-xs leading-relaxed"
                  style={{
                    background: "rgba(201,168,76,0.06)",
                    border: "1px solid rgba(201,168,76,0.16)",
                    color: "var(--muted-foreground)",
                  }}
                >
                  {PAYMENT_METHODS.find((method) => method.value === paymentMethod)?.instructions}
                </p>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs uppercase tracking-wider mb-2 font-semibold" style={{ color: "var(--rose-gold)" }}>Order Notes (Optional)</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={2}
                  className="block w-full px-4 py-2.5 rounded-2xl outline-none resize-none"
                  style={{ border: "1px solid rgba(201, 168, 76, 0.25)", background: "rgba(255, 255, 255, 0.04)", color: "var(--foreground)" }}
                  placeholder="Notes about your delivery instructions, e.g. code, gate key, etc."
                />
              </div>
            </div>
          </div>

          {/* Checkout Review Column */}
          <div className="space-y-6">
            {/* Items Summary */}
            <div
              className="p-6 rounded-3xl space-y-4"
              style={{
                background: "linear-gradient(135deg, #13100A, #1A1500)",
                border: "1px solid rgba(201, 168, 76, 0.15)",
              }}
            >
              <h3 className="text-sm font-bold uppercase tracking-wider flex items-center gap-2 border-b pb-2" style={{ color: "var(--rose-gold)", borderColor: "rgba(201,168,76,0.12)" }}>
                <ShoppingBag size={16} /> Review Order Items
              </h3>

              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3 text-xs items-center justify-between">
                    <div className="flex gap-2.5 items-center min-w-0">
                      {item.image && (
                        <ImageWithFallback src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded-lg shrink-0" />
                      )}
                      <div className="min-w-0">
                        <p className="font-bold truncate" style={{ color: "#F0E8D0" }}>{item.name}</p>
                        <p style={{ color: "var(--muted-foreground)" }}>Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-semibold" style={{ color: "#F0E8D0" }}>{formatCurrency(item.line_total)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total Summary & Order Placement */}
            <div
              className="p-8 rounded-3xl space-y-6"
              style={{
                background: "linear-gradient(135deg, #13100A, #1A1500)",
                border: "1px solid rgba(201, 168, 76, 0.18)",
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.4)",
              }}
            >
              <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: "var(--rose-gold)" }}>Pricing Details</h3>
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between" style={{ color: "var(--muted-foreground)" }}>
                  <span>Items Subtotal:</span>
                  <span style={{ color: "var(--foreground)" }}>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between" style={{ color: "var(--muted-foreground)" }}>
                  <span>Shipping Fee:</span>
                  <span style={{ color: "var(--foreground)" }}>{shippingCost === 0 ? "FREE" : formatCurrency(shippingCost)}</span>
                </div>
                <div className="border-t pt-2.5 flex justify-between font-bold text-base" style={{ color: "#F0E8D0", borderColor: "rgba(201,168,76,0.12)" }}>
                  <span>Total Due:</span>
                  <span>{formatCurrency(finalTotal)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitLoading || orderPlaced}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full text-white font-medium transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg text-sm"
                style={{
                  background: PRIMARY_CTA_BACKGROUND,
                  cursor: submitLoading || orderPlaced ? "not-allowed" : "pointer",
                  opacity: submitLoading || orderPlaced ? 0.7 : 1,
                }}
              >
                <CreditCard size={16} />
                <span>
                  {submitLoading
                    ? "Processing Order..."
                    : `Place ${PAYMENT_METHODS.find((method) => method.value === paymentMethod)?.label} Order`}
                </span>
              </button>
              <p className="text-[10px] text-center" style={{ color: "var(--muted-foreground)" }}>
                Order will be confirmed and processed for shipment.
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
