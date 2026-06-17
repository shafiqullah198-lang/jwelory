import React, { useState } from "react";
import { useAuth } from "../components/AuthContext";
import { Link, useNavigate, useSearchParams } from "react-router";
import { LogIn, User, Lock, AlertCircle } from "lucide-react";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const nextParam = searchParams.get("next") || "/";
  
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
      className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
      style={{ background: "#080600" }}
    >
      <div
        className="max-w-md w-full space-y-8 p-10 rounded-3xl"
        style={{
          background: "linear-gradient(135deg, #13100A, #1A1500)",
          border: "1px solid rgba(201, 168, 76, 0.2)",
          boxShadow: "0 20px 50px rgba(0, 0, 0, 0.6)",
        }}
      >
        <div className="text-center">
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              color: "var(--rose-gold)",
            }}
            className="text-3xl font-extrabold"
          >
            Welcome Back
          </h2>
          <p
            className="mt-2 text-sm"
            style={{ color: "var(--muted-foreground)" }}
          >
            Sign in to your Rosella account
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

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label
                className="block text-xs uppercase tracking-wider mb-2 font-semibold"
                style={{ color: "var(--rose-gold)" }}
              >
                Username or Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={18} style={{ color: "var(--muted-foreground)" }} />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-10 pr-4 py-3 rounded-full outline-none transition-all"
                  style={{
                    border: "1px solid rgba(201, 168, 76, 0.25)",
                    background: "rgba(255, 255, 255, 0.04)",
                    color: "var(--foreground)",
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                  placeholder="Enter username or email"
                />
              </div>
            </div>

            <div>
              <label
                className="block text-xs uppercase tracking-wider mb-2 font-semibold"
                style={{ color: "var(--rose-gold)" }}
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} style={{ color: "var(--muted-foreground)" }} />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-4 py-3 rounded-full outline-none transition-all"
                  style={{
                    border: "1px solid rgba(201, 168, 76, 0.25)",
                    background: "rgba(255, 255, 255, 0.04)",
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
              className="group relative w-full flex justify-center py-3.5 px-4 rounded-full text-white font-medium focus:outline-none transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
              style={{
                background: "linear-gradient(135deg, #E0C87A, #C9A84C)",
                fontFamily: "'DM Sans', sans-serif",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
              }}
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <LogIn
                  size={18}
                  className="transition-colors group-hover:text-white"
                  style={{ color: "rgba(255, 255, 255, 0.6)" }}
                />
              </span>
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </div>
        </form>

        <div className="text-center mt-6">
          <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
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
