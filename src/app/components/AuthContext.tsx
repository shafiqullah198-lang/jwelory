import React, { createContext, useContext, useState, useEffect } from "react";
import { apiFetch, initCsrf } from "../api";

export interface UserProfile {
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_staff: boolean;
  profile: UserProfile | null;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  apiOffline: boolean;
  login: (username: string, password: string) => Promise<User>;
  signup: (signupData: any) => Promise<User>;
  logout: () => Promise<void>;
  updateProfile: (profileData: any) => Promise<User>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [apiOffline, setApiOffline] = useState(false);

  // Load current user and set CSRF cookie
  useEffect(() => {
    async function loadUser() {
      try {
        await initCsrf();
        const data = await apiFetch("auth/me/");
        if (data && data.authenticated) {
          setUser(data.user);
        }
        setApiOffline(false);
      } catch (err) {
        console.error("Error loading session user:", err);
        setApiOffline(true);
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, []);

  const login = async (username: string, password: string) => {
    const data = await apiFetch("auth/login/", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
    if (data.success) {
      setUser(data.user);
      return data.user;
    }
    throw new Error(data.errors?.detail || "Login failed");
  };

  const signup = async (signupData: any) => {
    const data = await apiFetch("auth/signup/", {
      method: "POST",
      body: JSON.stringify(signupData),
    });
    if (data.success) {
      setUser(data.user);
      return data.user;
    }
    throw new Error(
      Object.values(data.errors || {})
        .map((v) => v)
        .join(" ") || "Signup failed"
    );
  };

  const logout = async () => {
    await apiFetch("auth/logout/", { method: "POST" });
    setUser(null);
  };

  const updateProfile = async (profileData: any) => {
    const data = await apiFetch("auth/profile/", {
      method: "POST",
      body: JSON.stringify(profileData),
    });
    if (data.success) {
      setUser(data.user);
      const refreshed = await apiFetch("auth/me/");
      if (refreshed?.authenticated) {
        setUser(refreshed.user);
        return refreshed.user;
      }
      return data.user;
    }
    throw new Error(data.message || "Failed to update profile");
  };

  const refreshUser = async () => {
    try {
      const data = await apiFetch("auth/me/");
      if (data && data.authenticated) {
        setUser(data.user);
      } else {
        setUser(null);
      }
      setApiOffline(false);
    } catch (err) {
      console.error("Error refreshing user state:", err);
      setApiOffline(true);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        apiOffline,
        login,
        signup,
        logout,
        updateProfile,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
