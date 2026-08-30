"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { createContext, useContext, useEffect, useState, ReactNode, useCallback, useRef } from "react";
import { supabase } from "@/utils/supabaseClient";

export type AuthState = "loading" | "unauthenticated" | "no-username" | "no-university" | "ready" | "banned";
export type UserRole = "admin" | "contributor" | "user";
export type UserStatus = "active" | "suspended" | "banned";

interface AuthContextType {
  authState: AuthState;
  email: string | null;
  username: string | null;
  university: string | null;
  defaultBranch: string | null;
  defaultSemester: string | null;
  role: UserRole;
  status: UserStatus;
  isAdmin: boolean;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>("loading");
  const [email, setEmail] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [university, setUniversity] = useState<string | null>(null);
  const [defaultBranch, setDefaultBranch] = useState<string | null>(null);
  const [defaultSemester, setDefaultSemester] = useState<string | null>(null);
  const [role, setRole] = useState<UserRole>("user");
  const [status, setStatus] = useState<UserStatus>("active");
  const [isAdminUser, setIsAdminUser] = useState<boolean>(false);
  const isFetchingRef = useRef(false);

  const fetchSession = useCallback(async () => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    try {
      const res = await fetch("/api/auth/me");
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        if (res.status === 403 && (errData.error === "ACCOUNT_BANNED" || errData.status === "banned")) {
          setAuthState("banned");
          setStatus("banned");
          if (errData.email) setEmail(errData.email);
        } else {
          setAuthState("unauthenticated");
          setEmail(null);
          setStatus("active");
        }
        setUsername(null);
        setUniversity(null);
        setDefaultBranch(null);
        setDefaultSemester(null);
        setRole("user");
        setIsAdminUser(false);
        return;
      }

      const data = await res.json();
      if (!data.authenticated) {
        if (data.error === "ACCOUNT_BANNED" || data.status === "banned") {
          setAuthState("banned");
          setStatus("banned");
          if (data.email) setEmail(data.email);
        } else {
          setAuthState("unauthenticated");
          setEmail(null);
          setStatus("active");
        }
        setUsername(null);
        setUniversity(null);
        setDefaultBranch(null);
        setDefaultSemester(null);
        setRole("user");
        setIsAdminUser(false);
      } else {
        setEmail(data.email);
        setUsername(data.username ?? null);
        setRole(data.role || (data.isAdmin ? "admin" : "user"));
        setStatus(data.status || "active");
        setIsAdminUser(!!data.isAdmin);
        setDefaultBranch(data.default_branch ?? null);
        setDefaultSemester(data.default_semester ?? null);

        if (data.status === "banned") {
          setAuthState("banned");
        } else if (!data.username) {
          setAuthState("no-username");
          setUniversity(data.university ?? null);
        } else if (!data.university) {
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
      setUsername(null);
      setUniversity(null);
      setDefaultBranch(null);
      setDefaultSemester(null);
      setRole("user");
      setStatus("active");
      setIsAdminUser(false);
    } finally {
      isFetchingRef.current = false;
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
        username,
        university,
        defaultBranch,
        defaultSemester,
        role,
        status,
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
