import React, { useState } from "react";
import { useAuth } from "../components/AuthContext";
import { Link, useNavigate } from "react-router";
import { UserPlus, User, Mail, Lock, AlertCircle } from "lucide-react";

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    password: "",
    password2: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.password2) {
      setError("Passwords do not match.");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    try {
      await signup(formData);
      navigate("/");
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
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
            Create Account
          </h2>
          <p
            className="mt-2 text-sm"
            style={{ color: "var(--muted-foreground)" }}
          >
            Join the Rosella Circle today
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

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                className="block text-xs uppercase tracking-wider mb-2 font-semibold"
                style={{ color: "var(--rose-gold)" }}
              >
                First Name
              </label>
              <input
                type="text"
                name="first_name"
                required
                value={formData.first_name}
                onChange={handleChange}
                className="block w-full px-4 py-3 rounded-full outline-none"
                style={{
                  border: "1px solid rgba(201, 168, 76, 0.25)",
                  background: "rgba(255, 255, 255, 0.04)",
                  color: "var(--foreground)",
                  fontFamily: "'DM Sans', sans-serif",
                }}
                placeholder="First"
              />
            </div>
            <div>
              <label
                className="block text-xs uppercase tracking-wider mb-2 font-semibold"
                style={{ color: "var(--rose-gold)" }}
              >
                Last Name
              </label>
              <input
                type="text"
                name="last_name"
                required
                value={formData.last_name}
                onChange={handleChange}
                className="block w-full px-4 py-3 rounded-full outline-none"
                style={{
                  border: "1px solid rgba(201, 168, 76, 0.25)",
                  background: "rgba(255, 255, 255, 0.04)",
                  color: "var(--foreground)",
                  fontFamily: "'DM Sans', sans-serif",
                }}
                placeholder="Last"
              />
            </div>
          </div>

          <div>
            <label
              className="block text-xs uppercase tracking-wider mb-2 font-semibold"
              style={{ color: "var(--rose-gold)" }}
            >
              Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User size={18} style={{ color: "var(--muted-foreground)" }} />
              </div>
              <input
                type="text"
                name="username"
                required
                value={formData.username}
                onChange={handleChange}
                className="block w-full pl-10 pr-4 py-3 rounded-full outline-none"
                style={{
                  border: "1px solid rgba(201, 168, 76, 0.25)",
                  background: "rgba(255, 255, 255, 0.04)",
                  color: "var(--foreground)",
                  fontFamily: "'DM Sans', sans-serif",
                }}
                placeholder="Choose username"
              />
            </div>
          </div>

          <div>
            <label
              className="block text-xs uppercase tracking-wider mb-2 font-semibold"
              style={{ color: "var(--rose-gold)" }}
            >
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail size={18} style={{ color: "var(--muted-foreground)" }} />
              </div>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="block w-full pl-10 pr-4 py-3 rounded-full outline-none"
                style={{
                  border: "1px solid rgba(201, 168, 76, 0.25)",
                  background: "rgba(255, 255, 255, 0.04)",
                  color: "var(--foreground)",
                  fontFamily: "'DM Sans', sans-serif",
                }}
                placeholder="Enter email"
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
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="block w-full pl-10 pr-4 py-3 rounded-full outline-none"
                style={{
                  border: "1px solid rgba(201, 168, 76, 0.25)",
                  background: "rgba(255, 255, 255, 0.04)",
                  color: "var(--foreground)",
                  fontFamily: "'DM Sans', sans-serif",
                }}
                placeholder="At least 8 characters"
              />
            </div>
          </div>

          <div>
            <label
              className="block text-xs uppercase tracking-wider mb-2 font-semibold"
              style={{ color: "var(--rose-gold)" }}
            >
              Confirm Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={18} style={{ color: "var(--muted-foreground)" }} />
              </div>
              <input
                type="password"
                name="password2"
                required
                value={formData.password2}
                onChange={handleChange}
                className="block w-full pl-10 pr-4 py-3 rounded-full outline-none"
                style={{
                  border: "1px solid rgba(201, 168, 76, 0.25)",
                  background: "rgba(255, 255, 255, 0.04)",
                  color: "var(--foreground)",
                  fontFamily: "'DM Sans', sans-serif",
                }}
                placeholder="Re-enter password"
              />
            </div>
          </div>

          <div className="pt-2">
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
                <UserPlus
                  size={18}
                  className="transition-colors group-hover:text-white"
                  style={{ color: "rgba(255, 255, 255, 0.6)" }}
                />
              </span>
              {loading ? "Registering..." : "Create Account"}
            </button>
          </div>
        </form>

        <div className="text-center mt-6">
          <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium transition-colors hover:opacity-85"
              style={{ color: "var(--rose-gold)" }}
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
