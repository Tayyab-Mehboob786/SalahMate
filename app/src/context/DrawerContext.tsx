/**
 * SalahMate Drawer Context (`src/context/DrawerContext.tsx`)
 *
 * Provides a global state contract for managing the custom left-side navigation drawer.
 * Enables any screen (`dashboard.tsx`, etc.) to trigger `openDrawer()` with clean separation of concerns.
 */

import React, { createContext, useContext, useMemo, useState } from 'react';

export interface DrawerContextType {
  isOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
}

const DrawerContext = createContext<DrawerContextType>({
  isOpen: false,
  openDrawer: () => {},
  closeDrawer: () => {},
  toggleDrawer: () => {},
});

export function useDrawer(): DrawerContextType {
  return useContext(DrawerContext);
}

export const DrawerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const openDrawer = () => setIsOpen(true);
  const closeDrawer = () => setIsOpen(false);
  const toggleDrawer = () => setIsOpen((prev) => !prev);

  const value = useMemo(
    () => ({
      isOpen,
      openDrawer,
      closeDrawer,
      toggleDrawer,
    }),
    [isOpen],
  );

  return <DrawerContext.Provider value={value}>{children}</DrawerContext.Provider>;
};
