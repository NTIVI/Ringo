"use client";
// src/components/TopBar.tsx
import React from "react";
import styles from "./TopBar.module.css";
import { useAppContext } from "@/context/AppProvider";

export const TopBar: React.FC = () => {
  const { balance, user } = useAppContext();

  return (
    <header className={styles.topbar}>
      <div className={styles.profile}>
        <div className={styles.avatar}>
          {user?.first_name?.charAt(0) || "U"}
        </div>
        <div className={styles.info}>
          <span className={styles.name}>{user?.first_name || "Guest"}</span>
        </div>
      </div>
      <div className={styles.balanceContainer}>
        <span className={styles.balance}>{balance.toLocaleString()}</span>
        <span className={styles.coinIcon}>💰</span>
      </div>
    </header>
  );
};
