"use client";

import { Iuser } from "@/interface";
import { useRouter } from "next/navigation";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

interface AuthContextType {
  user: Iuser | null;
  setUser: React.Dispatch<React.SetStateAction<Iuser | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<Iuser | null>(null);
  const router = useRouter();

  const checkLogin = useCallback(async () => {
    const currentPath = window.location.pathname;

    // Define public paths that don't require authentication
    const publicPaths = ["/", "/register"];
    const isPublicPath = (pathname: string) => {
      return publicPaths.includes(pathname);
    };

    const meResponse = await fetch("/api/user/me", {
      method: "POST",
      credentials: "include",
    });
    console.log("Check login response status:", meResponse.status);
    if (meResponse.status === 200) {
      const userData = await meResponse.json();
      console.log("User data fetched:", userData);
      setUser(userData);
    } else if (meResponse.status === 401) {
      const refreshResponse = await fetch("/api/auth/refresh", {
        credentials: "include",
      });

      if (refreshResponse.status === 200) {
        const userData = await fetch("/api/user/me", {
          credentials: "include",
        });
        const userJson = await userData.json();
        setUser(userJson);
      } else {
        setUser(null);
        // Only redirect to "/" if not on a public path
        if (!isPublicPath(currentPath)) {
          router.push("/");
        }
      }
    } else {
      setUser(null);
      // Only redirect to "/" if not on a public path
      if (!isPublicPath(currentPath)) {
        router.push("/");
      }
    }
  }, [router]);

  useEffect(() => {
    console.log("Check login starting...");
    checkLogin();
  }, [checkLogin]);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthActions = () => {
  const auth = useAuth();
  const router = useRouter();

  const setUser = auth!.setUser;

  const logout = async () => {
    setUser(null);
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    router.push("/");
  };

  return { logout };
};
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
