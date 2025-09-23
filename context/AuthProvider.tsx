"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { usePathname, useRouter } from "next/navigation";

interface AuthContextType {
  user: string | null;
  login: (username: string, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("accessToken");
    if (storedUser) {
      setUser(storedUser);
    }
    if (storedToken) {
      setAccessToken(storedToken);
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(async () => {
      if (accessToken) {
        try {
          const res = await fetch("/auth/refresh", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token: accessToken }),
          });

          if (res.status === 200) {
            const data = await res.json();
            setAccessToken(data.accessToken);
            localStorage.setItem("accessToken", data.accessToken);
          } else {
            console.error("Failed to refresh access token");
            logout();
          }
        } catch (err) {
          console.error("Error refreshing access token:", err);
          logout();
        }
      }
    }, 15 * 60 * 1000); // Refresh every 15 minutes

    return () => clearInterval(interval);
  }, [accessToken]);

  useEffect(() => {
    if (!user && pathname !== "/") {
      router.push("/");
    }
  }, [user, pathname, router]);

  const login = (username: string, token: string) => {
    setUser(username);
    setAccessToken(token);
    localStorage.setItem("user", username);
    localStorage.setItem("accessToken", token);
    router.push("/home");
  };

  const logout = () => {
    setUser(null);
    setAccessToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
