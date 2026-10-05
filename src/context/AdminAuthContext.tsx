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

  // Listen to Firebase Auth state changes and query authorization allowlist
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setIsLoading(true);
      if (currentUser) {
        setUser(currentUser);
        try {
          // Explicit admin authorization allowlist check via Firestore
          const adminDocRef = doc(db, "admins", currentUser.uid);
          const adminDocSnap = await getDoc(adminDocRef);

          if (adminDocSnap.exists()) {
            const data = adminDocSnap.data() as AdminProfile;
            if (data.isActive) {
              setAdminProfile(data);
              setAuthError(null);
            } else {
              setAdminProfile(null);
              setAuthError("Your administrator account has been deactivated.");
            }
          } else {
            // Authenticated in Firebase, but NOT in admins collection
            setAdminProfile(null);
            setAuthError(
              "Access Denied: Your account is authenticated with Firebase, but has not been authorized as an administrator."
            );
          }
        } catch {
          // If Firestore query fails (e.g. security rules or offline)
          setAdminProfile(null);
          setAuthError("Unable to verify administrator authorization.");
        }
      } else {
        setUser(null);
        setAdminProfile(null);
        setAuthError(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setAuthError(null);
    setIsLoading(true);

    try {
      // 1. Authenticate with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
      const authenticatedUser = userCredential.user;

      // 2. Explicit Admin Authorization Check
      const adminDocRef = doc(db, "admins", authenticatedUser.uid);
      const adminDocSnap = await getDoc(adminDocRef);

      if (!adminDocSnap.exists()) {
        // Authenticated in Firebase Auth, but NOT in admins allowlist
        await signOut(auth);
        setUser(null);
        setAdminProfile(null);
        const err = "Access Denied: Your account is not authorized as an administrator. Please contact the administrator.";
        setAuthError(err);
        setIsLoading(false);
        throw new Error(err);
      }

      const data = adminDocSnap.data() as AdminProfile;
      if (!data.isActive) {
        await signOut(auth);
        setUser(null);
        setAdminProfile(null);
        const err = "Access Denied: Your administrator access is deactivated.";
        setAuthError(err);
        setIsLoading(false);
        throw new Error(err);
      }

      // Success: User is both authenticated AND authorized
      setUser(authenticatedUser);
      setAdminProfile(data);
      setAuthError(null);
      setIsLoading(false);
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
