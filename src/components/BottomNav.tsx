"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./BottomNav.module.css";

export const BottomNav: React.FC = () => {
  const pathname = usePathname();

  const links = [
    { name: "Home", path: "/", icon: "🏠" },
    { name: "Games", path: "/games", icon: "🎲" },
    { name: "Quests", path: "/quests", icon: "⭐" },
    { name: "Shop", path: "/shop", icon: "🛍️" },
  ];

  return (
    <nav className={styles.nav}>
      {links.map((link) => {
        const isActive = pathname === link.path || (link.path !== "/" && pathname.startsWith(link.path));
        return (
          <Link key={link.path} href={link.path} className={`${styles.link} ${isActive ? styles.active : ""}`}>
            <span className={styles.icon}>{link.icon}</span>
            <span className={styles.text}>{link.name}</span>
          </Link>
        );
      })}
    </nav>
  );
};
