"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface AppContextType {
  balance: number;
  setBalance: React.Dispatch<React.SetStateAction<number>>;
  user: any;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [balance, setBalance] = useState(1000); // Placeholder balance
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Attempt to read Telegram user data from WebApp
    if (typeof window !== "undefined" && (window as any).Telegram?.WebApp) {
      const tg = (window as any).Telegram.WebApp;
      tg.ready();
      tg.expand();
      if (tg.initDataUnsafe?.user) {
        setUser(tg.initDataUnsafe.user);
        // Here we would also fetch authentic balance from our API
      }
    }
  }, []);

  return (
    <AppContext.Provider value={{ balance, setBalance, user }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppContext must be used within AppProvider");
  return context;
};
