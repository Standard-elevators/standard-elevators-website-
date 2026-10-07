"use client";

import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import {
  User,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  AuthError,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { AdminProfile, AdminAuthContextType } from "@/types/admin";

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function getAuthErrorMessage(errorCode: string): string {
  switch (errorCode) {
    case "auth/invalid-email":
      return "The email address is invalid.";
    case "auth/user-disabled":
      return "This administrator account has been disabled.";
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Invalid email or password. Please verify your credentials.";
    case "auth/too-many-requests":
      return "Access temporarily locked due to multiple failed login attempts. Please try again later.";
    case "auth/network-request-failed":
      return "A network error occurred. Please check your internet connection.";
    default:
      return "Authentication failed. Please check your credentials and try again.";
  }
}

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [adminProfile, setAdminProfile] = useState<AdminProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  // Set persistence once when component mounts
  useEffect(() => {
    if (typeof window !== "undefined") {
      setPersistence(auth, browserLocalPersistence).catch(() => {
        // Fallback to default memory or session if local persistence fails
      });
    }
  }, []);

  // Listen to Firebase Auth state changes or local mock auth
  useEffect(() => {
    const checkAuth = async (currentUser: User | null) => {
      setIsLoading(true);
      
      const isMockAdmin = typeof window !== 'undefined' && localStorage.getItem('mock_admin_auth') === 'true';
      
      if (isMockAdmin) {
        const mockUser = {
          uid: 'admin-hardcoded',
          email: 'standardengineeringworks12@gmail.com',
          getIdToken: async () => "mock-admin-token"
        } as unknown as User;
        
        setUser(mockUser);
        setAdminProfile({
          uid: 'admin-hardcoded',
          email: 'standardengineeringworks12@gmail.com',
          name: "Administrator",
          role: "admin",
          isActive: true
        } as AdminProfile);
        setAuthError(null);
      } else if (currentUser) {
        setUser(currentUser);
        setAdminProfile({
          uid: currentUser.uid,
          email: currentUser.email || "",
          name: "Administrator",
          role: "admin",
          isActive: true
        } as AdminProfile);
        setAuthError(null);
      } else {
        setUser(null);
        setAdminProfile(null);
        setAuthError(null);
      }
      setIsLoading(false);
    };

    // Run once on mount for mock auth, and then subscribe to Firebase
    checkAuth(auth.currentUser);
    const unsubscribe = onAuthStateChanged(auth, checkAuth);

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setAuthError(null);
    setIsLoading(true);

    try {
      const trimmedEmail = email.trim();
      
      if (trimmedEmail === "standardengineeringworks12@gmail.com" && password === "standardengineeringworks12@gmail.com") {
        if (typeof window !== 'undefined') {
          localStorage.setItem('mock_admin_auth', 'true');
        }
        
        const mockUser = { 
          uid: 'admin-hardcoded', 
          email: trimmedEmail,
          getIdToken: async () => "mock-admin-token"
        } as unknown as User;
        
        setUser(mockUser);
        setAdminProfile({
          uid: "admin-hardcoded",
          email: trimmedEmail,
          name: "Administrator",
          role: "admin",
          isActive: true
        } as AdminProfile);
        
        setAuthError(null);
        setIsLoading(false);
        return;
      } else {
        throw new Error("Invalid credentials. Access denied.");
      }
    } catch (err: unknown) {
      setIsLoading(false);
      const firebaseError = err as AuthError;

      if (firebaseError.code) {
        const friendlyMessage = getAuthErrorMessage(firebaseError.code);
        setAuthError(friendlyMessage);
        throw new Error(friendlyMessage);
      }

      const message = (err as Error).message || "Login failed.";
      setAuthError(message);
      throw new Error(message);
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('mock_admin_auth');
      }
      await signOut(auth);
      setUser(null);
      setAdminProfile(null);
      setAuthError(null);
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => {
    setAuthError(null);
  };

  const isAuthorizedAdmin = useMemo(() => {
    return Boolean(user && adminProfile && adminProfile.isActive);
  }, [user, adminProfile]);

  return (
    <AdminAuthContext.Provider
      value={{
        user,
        adminProfile,
        isLoading,
        isAuthorizedAdmin,
        authError,
        login,
        logout,
        clearError,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth(): AdminAuthContextType {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
  return context;
}
