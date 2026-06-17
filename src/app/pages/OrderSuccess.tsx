import React, { useEffect, useState } from "react";
import { formatCurrency } from "../utils";
import { useParams, Link } from "react-router";
import { CheckCircle2, ShoppingBag, ClipboardList, Printer, Loader2 } from "lucide-react";
import { apiFetch } from "../api";

export default function OrderSuccess() {
  const { order_number } = useParams<{ order_number: string }>();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (order_number) {
      apiFetch(`orders/${order_number}/`)
        .then((data) => {
          if (data && data.order) {
            setOrder(data.order);
          }
        })
        .catch((err) => console.error("Error loading order detail:", err))
        .finally(() => setLoading(false));
    }
  }, [order_number]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-start"
      style={{ background: "#080600" }}
    >
      {/* Injecting Print Styles */}
      <style>{`
        @media print {
          body {
            background: white !important;
            color: black !important;
          }
          #non-printable-content {
            display: none !important;
          }
          #printable-invoice-container {
            display: block !important;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 20px !important;
            background: white !important;
            color: black !important;
            border: 1px solid #ddd !important;
            border-radius: 0 !important;
            box-shadow: none !important;
          }
          /* Override styles for printing */
          #printable-invoice-container * {
            color: black !important;
            background: transparent !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* Main Container */}
      <div className="max-w-3xl w-full space-y-8">
        
        {/* Confirmation Banner (Non Printable) */}
        <div
          id="non-printable-content"
          className="p-10 rounded-3xl text-center space-y-6"
          style={{
            background: "linear-gradient(135deg, #13100A, #1A1500)",
            border: "1px solid rgba(201, 168, 76, 0.2)",
            boxShadow: "0 20px 50px rgba(0, 0, 0, 0.6)",
          }}
        >
          <div className="flex flex-col items-center">
            <CheckCircle2 size={56} style={{ color: "var(--rose-gold)" }} className="animate-bounce" />
            <h1
              style={{
                fontFamily: "'Playfair Display', serif",
                color: "var(--rose-gold)",
              }}
              className="text-3xl font-extrabold mt-4"
            >
              Order Confirmed!
            </h1>
            <p className="mt-2 text-sm" style={{ color: "var(--muted-foreground)" }}>
              Thank you for shopping with Rosella Luxury Jewels. Your purchase is complete.
            </p>
          </div>

          <div
            className="p-5 rounded-2xl border bg-black/20 text-sm"
            style={{ borderColor: "rgba(201, 168, 76, 0.15)" }}
          >
            <p style={{ color: "var(--muted-foreground)" }}>Your Order Number is</p>
            <p className="font-mono text-lg font-bold mt-1.5" style={{ color: "#F0E8D0" }}>
              #{order_number}
            </p>
            <p className="text-xs mt-3" style={{ color: "var(--muted-foreground)" }}>
              A confirmation receipt and invoice has been generated below.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <Link
              to="/orders"
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-full text-white font-medium border transition-all hover:bg-white/5"
              style={{
                borderColor: "rgba(201, 168, 76, 0.3)",
                background: "rgba(201, 168, 76, 0.05)",
                color: "var(--rose-gold)",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              <ClipboardList size={16} />
              <span>Track Orders</span>
            </Link>
            <button
              onClick={handlePrint}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-full text-white font-medium border transition-all hover:bg-white/5 cursor-pointer"
              style={{
                borderColor: "var(--rose-gold)",
                background: "transparent",
                color: "var(--rose-gold)",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              <Printer size={16} />
              <span>Print Invoice</span>
            </button>
            <Link
              to="/products"
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-full text-white font-medium transition-all hover:opacity-90"
              style={{
                background: "linear-gradient(135deg, #E0C87A, #C9A84C)",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              <ShoppingBag size={16} />
              <span>Continue Shopping</span>
            </Link>
          </div>
        </div>

        {/* Invoice Card */}
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="animate-spin text-rose-gold" size={24} />
          </div>
        ) : order ? (
          <div
            id="printable-invoice-container"
            className="p-8 sm:p-10 rounded-3xl space-y-6"
            style={{
              background: "#13100A",
              border: "1px solid rgba(201, 168, 76, 0.18)",
              boxShadow: "0 10px 30px rgba(0,0,0,0.5)"
            }}
          >
            {/* Store Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-6" style={{ borderColor: "rgba(201, 168, 76, 0.12)" }}>
              <div>
                <h2 className="text-xl font-bold tracking-widest text-white uppercase" style={{ fontFamily: "'Playfair Display', serif" }}>
                  ROSELLA
                </h2>
                <p className="text-xs uppercase tracking-wider mt-1" style={{ color: "var(--rose-gold)" }}>Luxury Jewels & Co.</p>
              </div>
              <div className="mt-4 sm:mt-0 text-left sm:text-right">
                <span className="text-xs uppercase tracking-wider font-semibold border px-3 py-1 rounded-full text-white" style={{ borderColor: "rgba(201, 168, 76, 0.2)" }}>
                  INVOICE / RECEIPT
                </span>
                <p className="text-xs mt-2" style={{ color: "var(--muted-foreground)" }}>Invoice No: #{order.order_number}</p>
                <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>Date: {new Date(order.created_at).toLocaleDateString()}</p>
              </div>
            </div>

            {/* Bill To Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--rose-gold)" }}>Billed To:</h4>
                <p className="font-bold text-white">{order.full_name}</p>
                <p style={{ color: "var(--muted-foreground)" }}>{order.email}</p>
                <p style={{ color: "var(--muted-foreground)" }}>{order.phone}</p>
              </div>
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--rose-gold)" }}>Shipping Address:</h4>
                <p className="text-white leading-relaxed">{order.address}</p>
                <p className="text-white">{order.city}, {order.state} - {order.pincode}</p>
                <p style={{ color: "var(--muted-foreground)" }}>Payment Method: Cash on Delivery (COD)</p>
              </div>
            </div>

            {/* Items Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b" style={{ borderColor: "rgba(201, 168, 76, 0.12)" }}>
                    <th className="py-2.5 font-semibold" style={{ color: "var(--rose-gold)" }}>Item Description</th>
                    <th className="py-2.5 font-semibold text-right" style={{ color: "var(--rose-gold)" }}>Price</th>
                    <th className="py-2.5 font-semibold text-center" style={{ color: "var(--rose-gold)" }}>Qty</th>
                    <th className="py-2.5 font-semibold text-right" style={{ color: "var(--rose-gold)" }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items?.map((item: any) => (
                    <tr key={item.id} className="border-b border-white/5">
                      <td className="py-3 font-medium text-white">{item.product_name}</td>
                      <td className="py-3 text-right" style={{ color: "var(--muted-foreground)" }}>Rs. {item.price.toLocaleString()}</td>
                      <td className="py-3 text-center text-white">{item.quantity}</td>
                      <td className="py-3 text-right font-semibold text-white">{formatCurrency(item.line_total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals Block */}
            <div className="flex flex-col items-end gap-2 text-sm pt-4 border-t" style={{ borderColor: "rgba(201,168,76,0.12)" }}>
              <div className="flex justify-between w-64 text-sm" style={{ color: "var(--muted-foreground)" }}>
                <span>Subtotal:</span>
                <span className="text-white font-medium">{formatCurrency(order.subtotal)}</span>
              </div>
              <div className="flex justify-between w-64 text-sm" style={{ color: "var(--muted-foreground)" }}>
                <span>Shipping:</span>
                <span className="text-white font-medium">{order.shipping === 0 ? "FREE" : `Rs. ${order.shipping}`}</span>
              </div>
              <div className="flex justify-between w-64 border-t pt-2 mt-2 font-bold text-base" style={{ color: "var(--rose-gold)", borderColor: "rgba(201,168,76,0.15)" }}>
                <span>Total Amount:</span>
                <span className="text-white font-extrabold">{formatCurrency(order.total)}</span>
              </div>
            </div>

            {/* Footer note */}
            <div className="text-center pt-8 border-t" style={{ borderColor: "rgba(201, 168, 76, 0.08)" }}>
              <p className="text-[11px]" style={{ color: "var(--muted-foreground)" }}>
                This is a computer generated receipt. Thank you for your luxury purchase at Rosella.
              </p>
            </div>
          </div>
        ) : (
          <div className="p-8 rounded-3xl text-center" style={{ background: "#13100A", border: "1px solid rgba(201, 168, 76, 0.18)" }}>
            <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>Could not load order details.</p>
          </div>
        )}

      </div>
    </div>
  );
}