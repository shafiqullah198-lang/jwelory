import React, { useState, useEffect } from "react";
import { useAuth } from "../components/AuthContext";
import { Link, useNavigate, useSearchParams } from "react-router";
import { User, Phone, MapPin, Mail, ClipboardList, CheckCircle2, AlertCircle, LogOut } from "lucide-react";

const cardStyle: React.CSSProperties = {
  background: "linear-gradient(135deg, rgba(19,16,10,0.96), rgba(26,21,0,0.92))",
  border: "1px solid rgba(201, 168, 76, 0.18)",
  boxShadow: "0 18px 50px rgba(0, 0, 0, 0.38)",
  backdropFilter: "blur(18px)",
};

const inputStyle: React.CSSProperties = {
  border: "1px solid rgba(201, 168, 76, 0.28)",
  background: "rgba(255, 255, 255, 0.045)",
  color: "#F0E8D0",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.035)",
};

const outlineButtonStyle: React.CSSProperties = {
  borderColor: "rgba(201, 168, 76, 0.34)",
  background: "rgba(201, 168, 76, 0.08)",
  color: "#E0C87A",
  fontFamily: "'DM Sans', sans-serif",
  textDecoration: "none",
};

export default function Profile() {
  const { user, updateProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const nextPage = searchParams.get("next");
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        phone: user.profile?.phone || "",
        address: user.profile?.address || "",
        city: user.profile?.city || "",
        state: user.profile?.state || "",
        pincode: user.profile?.pincode || "",
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);
    try {
      const updatedUser = await updateProfile(formData);
      setFormData({
        first_name: updatedUser.first_name || "",
        last_name: updatedUser.last_name || "",
        email: updatedUser.email || "",
        phone: updatedUser.profile?.phone || "",
        address: updatedUser.profile?.address || "",
        city: updatedUser.profile?.city || "",
        state: updatedUser.profile?.state || "",
        pincode: updatedUser.profile?.pincode || "",
      });
      setMessage("Profile updated successfully. Your account and delivery information has been saved.");
      if (nextPage?.startsWith("/")) {
        window.setTimeout(() => navigate(nextPage), 650);
      } else {
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (err: any) {
      setError(err.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    setError("");
    try {
      await logout();
    } catch (err: any) {
      console.error("Logout error:", err);
    } finally {
      navigate("/login", { replace: true });
    }
  };

  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4" style={{ background: "#080600" }}>
        <p className="mb-4 text-lg" style={{ color: "rgba(240,232,208,0.72)" }}>You need to be logged in to view your profile.</p>
        <Link to="/login" className="px-6 py-3 rounded-full text-white font-medium" style={{ background: "var(--rose-gold)" }}>Sign In</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 md:py-16" style={{ background: "linear-gradient(180deg, #080600 0%, #040300 48%, #080600 100%)" }}>
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        {/* Navigation Breadcrumb & Title */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", color: "#F0E8D0" }} className="text-3xl font-extrabold">My Profile</h1>
            <p className="text-sm" style={{ color: "rgba(240,232,208,0.58)" }}>Manage your account details and delivery addresses</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/orders"
              className="flex items-center gap-2 px-5 py-2.5 rounded-full border transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:bg-[rgba(201,168,76,0.14)]"
              style={outlineButtonStyle}
            >
              <ClipboardList size={18} />
              <span>Order History</span>
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full border transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:bg-[rgba(201,168,76,0.14)]"
              style={{
                ...outlineButtonStyle,
                opacity: loggingOut ? 0.7 : 1,
              }}
            >
              <LogOut size={18} />
              <span>{loggingOut ? "Logging out..." : "Logout"}</span>
            </button>
          </div>
        </div>

        {message && (
          <div
            className="flex items-center gap-2 p-4 rounded-xl text-sm mb-6"
            style={{
              background: "rgba(201, 168, 76, 0.1)",
              border: "1px solid rgba(201, 168, 76, 0.3)",
              color: "#E0C87A",
            }}
          >
            <CheckCircle2 size={18} className="shrink-0" />
            <span>{message}</span>
          </div>
        )}

        {error && (
          <div
            className="flex items-center gap-2 p-4 rounded-xl text-sm mb-6"
            style={{
              background: "rgba(212, 24, 61, 0.1)",
              border: "1px solid rgba(212, 24, 61, 0.3)",
              color: "var(--destructive)",
            }}
          >
            <AlertCircle size={18} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* User Basic Info Column */}
          <div
            className="p-6 md:p-8 rounded-2xl h-fit space-y-6"
            style={cardStyle}
          >
            <div className="flex flex-col items-center text-center">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4"
                style={{
                  background: "linear-gradient(135deg, #C9A84C, #8B6914)",
                }}
              >
                {user.first_name ? user.first_name[0] : user.username[0]}
              </div>
              <h2 className="text-xl font-bold" style={{ color: "#F0E8D0" }}>
                {user.first_name} {user.last_name}
              </h2>
              <p className="text-sm" style={{ color: "rgba(240,232,208,0.58)" }}>
                @{user.username}
              </p>
            </div>

            <div className="border-t" style={{ borderColor: "rgba(201,168,76,0.12)" }} />

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail size={16} style={{ color: "var(--rose-gold)" }} />
                <span className="text-sm overflow-hidden text-ellipsis" style={{ color: "rgba(240,232,208,0.78)" }}>{user.email}</span>
              </div>
              {user.profile?.phone && (
                <div className="flex items-center gap-3">
                  <Phone size={16} style={{ color: "var(--rose-gold)" }} />
                  <span className="text-sm" style={{ color: "rgba(240,232,208,0.78)" }}>{user.profile.phone}</span>
                </div>
              )}
              {(user.profile?.address || user.profile?.city || user.profile?.state) && (
                <div className="flex items-start gap-3">
                  <MapPin size={16} className="shrink-0 mt-0.5" style={{ color: "var(--rose-gold)" }} />
                  <span className="text-sm leading-relaxed" style={{ color: "rgba(240,232,208,0.78)" }}>
                    {[user.profile?.address, user.profile?.city, user.profile?.state, user.profile?.pincode].filter(Boolean).join(", ")}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Form Settings Details */}
          <div
            className="md:col-span-2 p-6 md:p-8 rounded-2xl space-y-6"
            style={cardStyle}
          >
            <h2 className="text-xl font-bold pb-2 border-b" style={{ color: "#E0C87A", borderColor: "rgba(201,168,76,0.16)" }}>
              Account & Delivery Info
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider mb-2 font-semibold" style={{ color: "var(--rose-gold)" }}>First Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={15} style={{ color: "var(--rose-gold)" }} />
                  </div>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-4 py-2.5 rounded-full outline-none transition-all focus:ring-2 focus:ring-[#C9A84C]/25"
                    style={inputStyle}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider mb-2 font-semibold" style={{ color: "var(--rose-gold)" }}>Last Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={15} style={{ color: "var(--rose-gold)" }} />
                  </div>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-4 py-2.5 rounded-full outline-none transition-all focus:ring-2 focus:ring-[#C9A84C]/25"
                    style={inputStyle}
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs uppercase tracking-wider mb-2 font-semibold" style={{ color: "var(--rose-gold)" }}>Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail size={15} style={{ color: "var(--rose-gold)" }} />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-4 py-2.5 rounded-full outline-none transition-all focus:ring-2 focus:ring-[#C9A84C]/25"
                    style={inputStyle}
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs uppercase tracking-wider mb-2 font-semibold" style={{ color: "var(--rose-gold)" }}>Phone Number</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone size={15} style={{ color: "var(--rose-gold)" }} />
                  </div>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-4 py-2.5 rounded-full outline-none transition-all focus:ring-2 focus:ring-[#C9A84C]/25"
                    style={inputStyle}
                    placeholder="Enter phone number"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs uppercase tracking-wider mb-2 font-semibold" style={{ color: "var(--rose-gold)" }}>Delivery Address</label>
                <div className="relative">
                  <div className="absolute top-3 left-3 pointer-events-none">
                    <MapPin size={15} style={{ color: "var(--rose-gold)" }} />
                  </div>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows={3}
                    className="block w-full pl-10 pr-4 py-2.5 rounded-2xl outline-none resize-none transition-all focus:ring-2 focus:ring-[#C9A84C]/25"
                    style={inputStyle}
                    placeholder="Enter street address and details"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider mb-2 font-semibold" style={{ color: "var(--rose-gold)" }}>City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="block w-full px-4 py-2.5 rounded-full outline-none transition-all focus:ring-2 focus:ring-[#C9A84C]/25"
                  style={inputStyle}
                  placeholder="City"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider mb-2 font-semibold" style={{ color: "var(--rose-gold)" }}>State</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="block w-full px-4 py-2.5 rounded-full outline-none transition-all focus:ring-2 focus:ring-[#C9A84C]/25"
                  style={inputStyle}
                  placeholder="State"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider mb-2 font-semibold" style={{ color: "var(--rose-gold)" }}>Pincode</label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  className="block w-full px-4 py-2.5 rounded-full outline-none transition-all focus:ring-2 focus:ring-[#C9A84C]/25"
                  style={inputStyle}
                  placeholder="Pincode"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 rounded-full font-semibold focus:outline-none transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                style={{
                  background: "var(--primary-cta-background)",
                  color: "var(--primary-foreground)",
                  fontFamily: "'DM Sans', sans-serif",
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? "Saving changes..." : "Save Changes"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
