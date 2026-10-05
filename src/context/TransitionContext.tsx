"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";

interface TransitionContextType {
  isInitialLoad: boolean;
  registerVideoEnded: () => void;
  registerVideoError: () => void;
  dismissLoader: () => void;
}

const TransitionContext = createContext<TransitionContextType>({
  isInitialLoad: false,
  registerVideoEnded: () => {},
  registerVideoError: () => {},
  dismissLoader: () => {},
});

export const useTransitionContext = () => useContext(TransitionContext);

interface ExtendedWindow extends Window {
  __hasPlayedLoader?: boolean;
}

const getHasPlayed = () => {
  if (typeof window === "undefined") return true; // Don't block SSR
  try {
    if (sessionStorage.getItem("se_has_played_loader") === "true") return true;
    if (localStorage.getItem("se_has_played_loader") === "true") return true;
  } catch {}
  return (window as unknown as ExtendedWindow).__hasPlayedLoader || false;
};

const setHasPlayed = (val: boolean) => {
  if (typeof window !== "undefined") {
    (window as unknown as ExtendedWindow).__hasPlayedLoader = val;
    try {
      if (val) {
        sessionStorage.setItem("se_has_played_loader", "true");
        localStorage.setItem("se_has_played_loader", "true");
      }
    } catch {}
  }
};

export function TransitionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isInitialLoad, setIsInitialLoad] = useState<boolean>(false);
  const mountedRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;
    // Check if loader should play on client mount (only if never played before)
    if (!getHasPlayed()) {
      setIsInitialLoad(true);
    }
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Universal dismissal callback
  const dismissLoader = useCallback(() => {
    setHasPlayed(true);
    setIsInitialLoad(false);
  }, []);

  const registerVideoEnded = useCallback(() => {
    dismissLoader();
  }, [dismissLoader]);

  const registerVideoError = useCallback(() => {
    dismissLoader();
  }, [dismissLoader]);

  return (
    <TransitionContext.Provider
      value={{
        isInitialLoad,
        registerVideoEnded,
        registerVideoError,
        dismissLoader,
      }}
    >
      {children}
    </TransitionContext.Provider>
  );
}

