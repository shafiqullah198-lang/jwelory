import React, { useEffect, useState } from "react";
import { formatCurrency } from "../utils";
import { apiFetch } from "../api";
import { Link } from "react-router";
import { ClipboardList, ChevronDown, ChevronUp, Package, MapPin, Calendar, Clock, Receipt } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

interface OrderItem {
  id: number;
  product_name: string;
  product_image: string;
  price: number;
  quantity: number;
  line_total: number;
}

interface Order {
  id: number;
  order_number: string;
  status: string;
  status_display: string;
  status_color: string;
  total: number;
  subtotal: number;
  shipping: number;
  created_at: string;
  item_count: number;
  // Detail fields
  full_name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  notes?: string;
  payment_method?: string;
  payment_method_display?: string;
  items?: OrderItem[];
}

export default function OrderHistory() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderNum, setExpandedOrderNum] = useState<string | null>(null);
  const [orderDetails, setOrderDetails] = useState<Record<string, Order>>({});
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    async function fetchHistory() {
      try {
        const data = await apiFetch("orders/history/");
        if (data && data.orders) {
          setOrders(data.orders);
        }
      } catch (err) {
        console.error("Failed to load order history:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchHistory();
  }, []);

  const handleToggleExpand = async (orderNumber: string) => {
    if (expandedOrderNum === orderNumber) {
      setExpandedOrderNum(null);
      return;
    }

    setExpandedOrderNum(orderNumber);

    // Fetch details if not cached
    if (!orderDetails[orderNumber]) {
      setDetailLoading(true);
      try {
        const data = await apiFetch(`orders/${orderNumber}/`);
        if (data && data.order) {
          setOrderDetails((prev) => ({ ...prev, [orderNumber]: data.order }));
        }
      } catch (err) {
        console.error("Failed to load order details:", err);
      } finally {
        setDetailLoading(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#080600" }}>
        <p className="text-lg" style={{ color: "var(--rose-gold)" }}>Loading order history...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16 md:py-20" style={{ background: "#080600" }}>
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", color: "#F0E8D0" }} className="text-3xl font-extrabold">Order History</h1>
            <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>Track and review your purchases</p>
          </div>
          <Link
            to="/profile"
            className="flex items-center gap-2 px-5 py-2.5 rounded-full border transition-all"
            style={{
              borderColor: "rgba(201, 168, 76, 0.3)",
              background: "rgba(201, 168, 76, 0.05)",
              color: "var(--rose-gold)",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            <span>My Profile</span>
          </Link>
        </div>

        {orders.length === 0 ? (
          <div
            className="text-center p-12 rounded-3xl"
            style={{
              background: "linear-gradient(135deg, #13100A, #1A1500)",
              border: "1px solid rgba(201, 168, 76, 0.15)",
            }}
          >
            <Package size={48} style={{ color: "var(--muted-foreground)" }} className="mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2" style={{ color: "#F0E8D0" }}>No Orders Found</h2>
            <p className="text-sm mb-6" style={{ color: "var(--muted-foreground)" }}>You haven't placed any orders yet.</p>
            <Link
              to="/products"
              className="inline-block px-8 py-3 rounded-full text-white font-medium"
              style={{ background: "linear-gradient(135deg, #E0C87A, #C9A84C)" }}
            >
              Shop Collection
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const isExpanded = expandedOrderNum === order.order_number;
              const details = orderDetails[order.order_number];

              return (
                <div
                  key={order.order_number}
                  className="rounded-3xl overflow-hidden transition-all duration-300"
                  style={{
                    background: "linear-gradient(135deg, #13100A, #1A1500)",
                    border: isExpanded
                      ? "1px solid rgba(201, 168, 76, 0.35)"
                      : "1px solid rgba(201, 168, 76, 0.15)",
                    boxShadow: isExpanded ? "0 10px 30px rgba(0, 0, 0, 0.4)" : "0 4px 12px rgba(0, 0, 0, 0.2)",
                  }}
                >
                  {/* Order summary header */}
                  <div
                    onClick={() => handleToggleExpand(order.order_number)}
                    className="p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 cursor-pointer select-none hover:bg-white/5 transition-colors"
                  >
                    <div className="grid grid-cols-2 md:flex md:items-center gap-4 md:gap-8 flex-1">
                      <div>
                        <p className="text-xs uppercase tracking-wider font-semibold" style={{ color: "var(--rose-gold)" }}>Order ID</p>
                        <p className="font-mono text-sm mt-1" style={{ color: "var(--foreground)" }}>#{order.order_number}</p>
                      </div>

                      <div>
                        <p className="text-xs uppercase tracking-wider font-semibold" style={{ color: "var(--rose-gold)" }}>Placed On</p>
                        <p className="text-sm mt-1" style={{ color: "var(--foreground)" }}>
                          {new Date(order.created_at).toLocaleDateString(undefined, { dateStyle: "medium" })}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs uppercase tracking-wider font-semibold" style={{ color: "var(--rose-gold)" }}>Total</p>
                        <p className="text-sm font-semibold mt-1" style={{ color: "var(--foreground)" }}>{formatCurrency(order.total)}</p>
                      </div>

                      <div>
                        <p className="text-xs uppercase tracking-wider font-semibold" style={{ color: "var(--rose-gold)" }}>Status</p>
                        <span
                          className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold mt-1"
                          style={{
                            background: `${order.status_color}20`,
                            color: order.status_color,
                            border: `1px solid ${order.status_color}40`,
                          }}
                        >
                          {order.status_display}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      {isExpanded ? (
                        <ChevronUp size={20} style={{ color: "var(--rose-gold)" }} />
                      ) : (
                        <ChevronDown size={20} style={{ color: "var(--rose-gold)" }} />
                      )}
                    </div>
                  </div>

                  {/* Expanded Order Details */}
                  {isExpanded && (
                    <div className="border-t px-6 py-8 md:px-8 space-y-6" style={{ borderColor: "rgba(201,168,76,0.12)" }}>
                      {detailLoading && !details ? (
                        <p className="text-center text-sm" style={{ color: "var(--muted-foreground)" }}>Loading items details...</p>
                      ) : details ? (
                        <>
                          {/* Shipping details */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <h3 className="text-sm font-bold uppercase tracking-wider flex items-center gap-2" style={{ color: "var(--rose-gold)" }}>
                                <MapPin size={16} /> Delivery Address
                              </h3>
                              <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>{details.full_name}</p>
                              <p className="text-sm leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
                                {details.address},<br />
                                {details.city}, {details.state} - {details.pincode}
                              </p>
                              <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>Phone: {details.phone}</p>
                              <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
                                Payment: {details.payment_method_display || "Cash on Delivery"}
                              </p>
                            </div>

                            <div className="space-y-2">
                              <h3 className="text-sm font-bold uppercase tracking-wider flex items-center gap-2" style={{ color: "var(--rose-gold)" }}>
                                <Receipt size={16} /> Summary
                              </h3>
                              <div className="space-y-1.5 text-sm">
                                <div className="flex justify-between" style={{ color: "var(--muted-foreground)" }}>
                                  <span>Subtotal:</span>
                                  <span>Rs. {details.subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between" style={{ color: "var(--muted-foreground)" }}>
                                  <span>Shipping:</span>
                                  <span>{details.shipping === 0 ? "FREE" : `Rs. ${details.shipping}`}</span>
                                </div>
                                <div className="border-t pt-1.5 flex justify-between font-bold" style={{ color: "#F0E8D0", borderColor: "rgba(201,168,76,0.12)" }}>
                                  <span>Total Amount:</span>
                                  <span>Rs. {details.total.toLocaleString()}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Order items listing */}
                          <div className="space-y-3">
                            <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: "var(--rose-gold)" }}>Items Purchased</h3>
                            <div className="space-y-3">
                              {details.items?.map((item) => (
                                <div
                                  key={item.id}
                                  className="flex items-center gap-4 p-3 rounded-2xl"
                                  style={{ background: "rgba(0,0,0,0.2)", border: "1px solid rgba(201,168,76,0.08)" }}
                                >
                                  {item.product_image ? (
                                    <ImageWithFallback
                                      src={item.product_image}
                                      alt={item.product_name}
                                      className="w-14 h-14 object-cover rounded-xl shrink-0"
                                      style={{ border: "1px solid rgba(201,168,76,0.12)" }}
                                    />
                                  ) : (
                                    <div className="w-14 h-14 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                                      <Package size={20} style={{ color: "var(--muted-foreground)" }} />
                                    </div>
                                  )}
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold truncate" style={{ color: "#F0E8D0" }}>{item.product_name}</p>
                                    <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
                                      {formatCurrency(item.price)} x {item.quantity}
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-sm font-semibold" style={{ color: "#F0E8D0" }}>
                                      Rs. {item.line_total.toLocaleString()}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </>
                      ) : (
                        <p className="text-center text-sm" style={{ color: "var(--destructive)" }}>Failed to load details.</p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
