import { useEffect, useState } from "react";
import { CheckCircle2, Mail, MapPin, MessageCircle, Phone, Send } from "lucide-react";
import { apiFetch } from "../api";
import {
  BRAND_NAME,
  BUSINESS_EMAIL,
  BUSINESS_LOCATION,
  BUSINESS_PHONE,
  BUSINESS_WHATSAPP,
} from "../components/BrandLogo";

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = `Contact Us | ${BRAND_NAME}`;
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setSuccess("");
    setError("");
    try {
      const data = await apiFetch("contact/", {
        method: "POST",
        body: JSON.stringify(formData),
      });
      setSuccess(data.message || "Thank you! We will get back to you soon.");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err: any) {
      setError(err.message || "Unable to send your message. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyle = {
    border: "1px solid rgba(201,168,76,0.25)",
    background: "rgba(255,255,255,0.04)",
    color: "var(--foreground)",
  };

  return (
    <main className="min-h-screen py-16 md:py-24" style={{ background: "#060400" }}>
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <div className="text-center mb-14">
          <p className="text-xs tracking-[0.25em] uppercase font-semibold" style={{ color: "var(--rose-gold)" }}>Contact Us</p>
          <h1 className="mt-3 text-3xl md:text-4xl font-semibold" style={{ fontFamily: "'Playfair Display', serif", color: "var(--foreground)" }}>
            We’re Here to Help
          </h1>
          <p className="mt-4 max-w-xl mx-auto text-sm leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
            Questions about an order, product, or styling? Send us a message and our team will get back to you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="space-y-4">
            <a href={`mailto:${BUSINESS_EMAIL}`} className="flex items-start gap-4 p-6 rounded-3xl" style={{ background: "linear-gradient(135deg, #13100A, #1A1500)", border: "1px solid rgba(201,168,76,0.18)", color: "inherit", textDecoration: "none" }}>
              <Mail size={20} style={{ color: "var(--rose-gold)" }} />
              <div><h2 className="font-semibold" style={{ color: "var(--foreground)" }}>Email</h2><p className="mt-1 text-sm" style={{ color: "var(--muted-foreground)" }}>{BUSINESS_EMAIL}</p></div>
            </a>
            <a href={`https://wa.me/${BUSINESS_WHATSAPP}`} className="flex items-start gap-4 p-6 rounded-3xl" style={{ background: "linear-gradient(135deg, #13100A, #1A1500)", border: "1px solid rgba(201,168,76,0.18)", color: "inherit", textDecoration: "none" }}>
              <Phone size={20} style={{ color: "var(--rose-gold)" }} />
              <div><h2 className="font-semibold" style={{ color: "var(--foreground)" }}>Phone / WhatsApp</h2><p className="mt-1 text-sm" style={{ color: "var(--muted-foreground)" }}>{BUSINESS_PHONE}</p></div>
            </a>
            <div className="flex items-start gap-4 p-6 rounded-3xl" style={{ background: "linear-gradient(135deg, #13100A, #1A1500)", border: "1px solid rgba(201,168,76,0.18)" }}>
              <MapPin size={20} style={{ color: "var(--rose-gold)" }} />
              <div><h2 className="font-semibold" style={{ color: "var(--foreground)" }}>Address</h2><p className="mt-1 text-sm" style={{ color: "var(--muted-foreground)" }}>{BUSINESS_LOCATION}</p></div>
            </div>
            <a href={`https://wa.me/${BUSINESS_WHATSAPP}`} className="flex items-center justify-center gap-2 w-full py-3.5 rounded-full font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg" style={{ background: "var(--primary-cta-background)", color: "var(--primary-foreground)", textDecoration: "none" }}>
              <MessageCircle size={17} /> Chat on WhatsApp
            </a>
          </div>

          <form onSubmit={handleSubmit} className="lg:col-span-2 p-7 md:p-9 rounded-3xl space-y-5" style={{ background: "linear-gradient(135deg, #13100A, #1A1500)", border: "1px solid rgba(201,168,76,0.18)", boxShadow: "0 10px 30px rgba(0,0,0,0.4)" }}>
            <h2 className="text-xl font-semibold" style={{ fontFamily: "'Playfair Display', serif", color: "var(--foreground)" }}>Send a Message</h2>
            {success && <div className="flex items-center gap-2 p-4 rounded-xl text-sm" style={{ background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.3)", color: "var(--rose-gold)" }}><CheckCircle2 size={18} />{success}</div>}
            {error && <div className="p-4 rounded-xl text-sm" style={{ background: "rgba(212,24,61,0.1)", border: "1px solid rgba(212,24,61,0.3)", color: "var(--destructive)" }}>{error}</div>}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Your name" className="px-4 py-3 rounded-full outline-none" style={inputStyle} />
              <input required type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="Email address" className="px-4 py-3 rounded-full outline-none" style={inputStyle} />
            </div>
            <input required value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} placeholder="Subject" className="w-full px-4 py-3 rounded-full outline-none" style={inputStyle} />
            <textarea required rows={6} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} placeholder="How can we help?" className="w-full px-4 py-3 rounded-2xl outline-none resize-none" style={inputStyle} />
            <button disabled={submitting} type="submit" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg" style={{ background: "var(--primary-cta-background)", color: "var(--primary-foreground)", opacity: submitting ? 0.7 : 1 }}>
              <Send size={16} /> {submitting ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
