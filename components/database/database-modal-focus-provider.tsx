"use client";

import { createContext, useCallback, useContext, useMemo, useRef } from "react";

type ModalFocus = {
  remember: (element: HTMLElement | null) => void;
  restore: () => void;
};

const DatabaseModalFocusContext = createContext<ModalFocus | null>(null);

export const useDatabaseModalFocus = () =>
  useContext(DatabaseModalFocusContext);

const DatabaseModalFocusProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const returnFocusRef = useRef<HTMLElement | null>(null);

  const remember = useCallback((element: HTMLElement | null) => {
    if (returnFocusRef.current?.isConnected) return;
    if (
      !element ||
      element === document.body ||
      element.closest('[role="dialog"]')
    )
      return;
    returnFocusRef.current = element;
  }, []);

  const restore = useCallback(() => {
    // A replacement detail may already be open when the previous dialog unmounts.
    if (document.querySelector('[role="dialog"]')) return;
    if (returnFocusRef.current?.isConnected) {
      returnFocusRef.current.focus({ preventScroll: true });
    }
    returnFocusRef.current = null;
  }, []);

  const value = useMemo(() => ({ remember, restore }), [remember, restore]);

  return (
    <DatabaseModalFocusContext.Provider value={value}>
      {children}
    </DatabaseModalFocusContext.Provider>
  );
};

export default DatabaseModalFocusProvider;
