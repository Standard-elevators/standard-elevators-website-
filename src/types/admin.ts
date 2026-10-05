import { Timestamp } from "firebase/firestore";

export interface AdminProfile {
  email: string;
  role: "admin" | "superadmin";
  isActive: boolean;
  displayName?: string;
  createdAt?: Timestamp | string;
  lastLoginAt?: Timestamp | string;
}

export interface AdminAuthContextType {
  user: import("firebase/auth").User | null;
  adminProfile: AdminProfile | null;
  isLoading: boolean;
  isAuthorizedAdmin: boolean;
  authError: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}
