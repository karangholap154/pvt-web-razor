"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { supabase } from "@/utils/supabaseClient";

export type AuthState = "loading" | "unauthenticated" | "no-university" | "ready";

interface AuthContextType {
  authState: AuthState;
  email: string | null;
  university: string | null;
  isAdmin: boolean;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>("loading");
  const [email, setEmail] = useState<string | null>(null);
  const [university, setUniversity] = useState<string | null>(null);
  const [isAdminUser, setIsAdminUser] = useState<boolean>(false);

  const fetchSession = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (!res.ok) {
        setAuthState("unauthenticated");
        setEmail(null);
        setUniversity(null);
        setIsAdminUser(false);
        return;
      }

      const data = await res.json();
      if (!data.authenticated) {
        setAuthState("unauthenticated");
        setEmail(null);
        setUniversity(null);
        setIsAdminUser(false);
      } else {
        setEmail(data.email);
        setIsAdminUser(!!data.isAdmin);
        if (!data.university) {
          setAuthState("no-university");
          setUniversity(null);
        } else {
          setUniversity(data.university);
          setAuthState("ready");
        }
      }
    } catch (error) {
      console.error("Auth fetch failed in provider:", error);
      setAuthState("unauthenticated");
      setEmail(null);
      setUniversity(null);
      setIsAdminUser(false);
    }
  }, []);

  // Fetch session on initial mount
  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  // Set up Supabase auth state change listener to keep client context in sync
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_UPDATED") {
        await fetchSession();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchSession]);

  return (
    <AuthContext.Provider
      value={{
        authState,
        email,
        university,
        isAdmin: isAdminUser,
        refreshAuth: fetchSession,
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
