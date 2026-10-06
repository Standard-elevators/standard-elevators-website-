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

export function TransitionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true);
  const mountedRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Universal dismissal callback
  const dismissLoader = useCallback(() => {
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

