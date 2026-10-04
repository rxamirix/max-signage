"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

const STORAGE_KEY = "max-admin-hints";

type AdminHintsContextValue = {
  showHints: boolean;
  toggleHints: () => void;
  setShowHints: (value: boolean) => void;
};

const AdminHintsContext = createContext<AdminHintsContextValue>({
  showHints: false,
  toggleHints: () => undefined,
  setShowHints: () => undefined,
});

export function AdminHintsProvider({ children }: { children: ReactNode }) {
  const [showHints, setShowHintsState] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "1") setShowHintsState(true);
      else setShowHintsState(false);
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  const setShowHints = useCallback((value: boolean) => {
    setShowHintsState(value);
    try {
      localStorage.setItem(STORAGE_KEY, value ? "1" : "0");
    } catch {
      /* ignore */
    }
  }, []);

  const toggleHints = useCallback(() => {
    setShowHintsState((current) => {
      const next = !current;
      try {
        localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  return (
    <AdminHintsContext.Provider
      value={{ showHints: ready ? showHints : false, toggleHints, setShowHints }}
    >
      {children}
    </AdminHintsContext.Provider>
  );
}

export function useAdminHints() {
  return useContext(AdminHintsContext);
}

/** Only renders children when hints are enabled */
export function AdminHint({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const { showHints } = useAdminHints();
  if (!showHints) return null;
  return <div className={className}>{children}</div>;
}
