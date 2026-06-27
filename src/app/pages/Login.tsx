import React, { useState } from "react";
import { useAuth } from "../components/AuthContext";
import { Link, useNavigate, useSearchParams } from "react-router";
import { AlertCircle, Eye, EyeOff, Lock, LogIn, User } from "lucide-react";
import { BRAND_NAME, BrandLogo } from "../components/BrandLogo";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const nextParam = searchParams.get("next") || "/";
  
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(username, password);
      navigate(nextParam);
    } catch (err: any) {
      setError(err.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8"
      style={{ background: "var(--page-background)" }}
    >
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-[1fr_26rem] gap-6 lg:gap-8 items-stretch">
        <section
          className="hidden lg:flex rounded-3xl overflow-hidden p-10 flex-col justify-between"
          style={{
            background: "linear-gradient(135deg, rgba(19,16,10,0.96), rgba(26,21,0,0.9))",
            border: "1px solid rgba(201, 168, 76, 0.18)",
            boxShadow: "var(--luxury-shadow)",
          }}
        >
          <BrandLogo
            imageClassName="h-14 w-14 object-contain"
            titleClassName="text-[1rem] font-semibold tracking-[0.16em] text-[var(--rose-gold)]"
            taglineClassName="mt-1 text-[0.56rem] tracking-[0.34em] uppercase text-[var(--text-faint)]"
          />
          <div>
            <p className="mb-4 text-xs uppercase tracking-[0.28em]" style={{ color: "var(--rose-gold)" }}>Account Access</p>
            <h1
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(2.25rem, 5vw, 4rem)",
                lineHeight: 1.05,
                color: "#F0E8D0",
              }}
            >
              Your jewelry box, ready when you are.
            </h1>
            <p className="mt-5 max-w-md text-sm leading-7" style={{ color: "rgba(240,232,208,0.66)" }}>
              Sign in once to track orders, save your wishlist, and move through checkout faster.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            {["Fast checkout", "Order tracking", "Saved wishlist"].map((item) => (
              <div key={item} className="rounded-2xl px-3 py-4" style={{ background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.16)" }}>
                <p className="text-[0.68rem] uppercase tracking-[0.12em]" style={{ color: "#E0C87A" }}>{item}</p>
              </div>
            ))}
          </div>
        </section>

        <div
          className="w-full space-y-6 p-6 sm:p-8 md:p-10 rounded-3xl"
          style={{
            background: "var(--surface-luxury)",
            border: "1px solid rgba(201, 168, 76, 0.22)",
            boxShadow: "var(--luxury-shadow)",
          }}
        >
          <div className="lg:hidden flex justify-center">
            <BrandLogo
              align="center"
              imageClassName="h-12 w-12 object-contain"
              titleClassName="text-[0.82rem] font-semibold tracking-[0.13em] text-[var(--rose-gold)]"
              taglineClassName="mt-1 text-[0.5rem] tracking-[0.25em] uppercase text-[var(--text-faint)]"
            />
          </div>

          <div className="text-center lg:text-left">
            <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              color: "var(--foreground)",
            }}
            className="text-3xl md:text-4xl font-extrabold"
            >
              Welcome Back
            </h2>
            <p className="mt-2 text-sm" style={{ color: "var(--text-soft)" }}>
              Sign in to your {BRAND_NAME} account.
            </p>
          </div>

          {error && (
            <div
              className="flex items-center gap-2 p-4 rounded-xl text-sm"
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

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider mb-2 font-semibold" style={{ color: "var(--rose-gold)" }}>
                  Username or Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={18} style={{ color: "var(--rose-gold)" }} />
                  </div>
                  <input
                    type="text"
                    required
                    autoComplete="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="block w-full pl-10 pr-4 py-3.5 rounded-full outline-none transition-all focus:ring-2 focus:ring-[#C9A84C]/25"
                    style={{
                      border: "1px solid rgba(201, 168, 76, 0.28)",
                      background: "var(--surface-input)",
                      color: "var(--foreground)",
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                    placeholder="Username or email"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider mb-2 font-semibold" style={{ color: "var(--rose-gold)" }}>
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={18} style={{ color: "var(--rose-gold)" }} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-12 py-3.5 rounded-full outline-none transition-all focus:ring-2 focus:ring-[#C9A84C]/25"
                    style={{
                      border: "1px solid rgba(201, 168, 76, 0.28)",
                      background: "var(--surface-input)",
                      color: "var(--foreground)",
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                    placeholder="Password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                    style={{ color: "var(--muted-foreground)" }}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3.5 px-4 rounded-full font-semibold focus:outline-none transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
              style={{
                background: "var(--primary-cta-background)",
                color: "var(--primary-foreground)",
                fontFamily: "'DM Sans', sans-serif",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
              }}
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <LogIn
                  size={18}
                  className="transition-colors"
                  style={{ color: "rgba(0, 0, 0, 0.55)" }}
                />
              </span>
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="text-center text-sm" style={{ color: "var(--text-soft)" }}>
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-medium transition-colors hover:opacity-85"
              style={{ color: "var(--rose-gold)" }}
            >
              Sign up now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
