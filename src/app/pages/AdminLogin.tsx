import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useAuth } from "../components/AuthContext";
import { LogIn, User, Lock, AlertCircle, ShieldAlert } from "lucide-react";
import { apiFetch } from "../api";

export default function AdminLogin() {
  const { user, refreshUser, apiOffline } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // If already logged in as admin, redirect
  useEffect(() => {
    if (user && user.is_staff) {
      navigate("/admin/dashboard");
    }
  }, [user, navigate]);

  // Handle errors from redirect
  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam === "not_admin") {
      setError("You are not allowed to access admin panel.");
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await apiFetch("admin/login/", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      });

      if (!data?.success) {
        throw new Error(data.message || "Invalid credentials.");
      }

      await refreshUser();
      navigate("/admin/dashboard");
    } catch (err: any) {
      if (err.message?.includes("Failed to fetch") || err.name === "TypeError") {
        setError("Backend API is currently offline. Please check if the Django server is running.");
      } else {
        setError(err.message || "An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
      style={{ background: "#060400" }}
    >
      <div
        className="max-w-md w-full space-y-8 p-10 rounded-3xl"
        style={{
          background: "linear-gradient(135deg, #100d05, #141000)",
          border: "1px solid rgba(201, 168, 76, 0.25)",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.7)",
        }}
      >
        <div className="text-center flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-[#C9A84C]/10 border border-[#C9A84C]/20 flex items-center justify-center mb-4 text-[#C9A84C]">
            <ShieldAlert size={24} />
          </div>
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              color: "var(--rose-gold)",
            }}
            className="text-3xl font-extrabold tracking-wide"
          >
            Rosella Control Center
          </h2>
          <p
            className="mt-2 text-xs uppercase tracking-widest font-semibold"
            style={{ color: "var(--muted-foreground)" }}
          >
            Luxury Jewelry Admin Login
          </p>
        </div>

        {(apiOffline || error) && (
          <div
            className="flex items-center gap-2.5 p-4 rounded-xl text-xs leading-relaxed"
            style={{
              background: "rgba(212, 24, 61, 0.08)",
              border: "1px solid rgba(212, 24, 61, 0.25)",
              color: "#ff5277",
            }}
          >
            <AlertCircle size={16} className="shrink-0" />
            <span>
              {apiOffline
                ? "Backend API is currently offline. Please check if the Django server is running."
                : error}
            </span>
          </div>
        )}

        <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label
                className="block text-[10px] uppercase tracking-widest mb-2 font-bold"
                style={{ color: "var(--rose-gold)" }}
              >
                Administrator Username / Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={16} style={{ color: "var(--muted-foreground)" }} />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-10 pr-4 py-3 rounded-full outline-none transition-all text-xs"
                  style={{
                    border: "1px solid rgba(201, 168, 76, 0.2)",
                    background: "rgba(255, 255, 255, 0.02)",
                    color: "var(--foreground)",
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                  placeholder="Enter admin username"
                />
              </div>
            </div>

            <div>
              <label
                className="block text-[10px] uppercase tracking-widest mb-2 font-bold"
                style={{ color: "var(--rose-gold)" }}
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={16} style={{ color: "var(--muted-foreground)" }} />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-4 py-3 rounded-full outline-none transition-all text-xs"
                  style={{
                    border: "1px solid rgba(201, 168, 76, 0.25)",
                    background: "rgba(255, 255, 255, 0.02)",
                    color: "var(--foreground)",
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                  placeholder="Enter password"
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3.5 px-4 rounded-full text-black text-xs font-bold uppercase tracking-wider focus:outline-none transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
              style={{
                background: "linear-gradient(135deg, #E0C87A, #C9A84C)",
                fontFamily: "'DM Sans', sans-serif",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.75 : 1,
              }}
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <LogIn
                  size={16}
                  className="transition-colors text-black/60 group-hover:text-black"
                />
              </span>
              {loading ? "Verifying Credentials..." : "Authenticate Admin"}
            </button>
          </div>
        </form>

        <div className="text-center mt-4">
          <a
            href="/"
            className="text-[10px] uppercase tracking-widest font-semibold hover:underline"
            style={{ color: "var(--muted-foreground)" }}
          >
            ← Return to Storefront
          </a>
        </div>
      </div>
    </div>
  );
}
