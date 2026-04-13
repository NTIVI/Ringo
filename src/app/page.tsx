"use client";

import React from "react";
import styles from "./page.module.css";
import { Button } from "@/components/Button";
import { useAppContext } from "@/context/AppProvider";
import Link from "next/link";

export default function Home() {
  const { balance, user } = useAppContext();

  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <h1 className={styles.title}>Welcome back, {user?.first_name || "Player"}!</h1>
        <div className={styles.balanceCard}>
          <div className={styles.balanceLabel}>Total Balance</div>
          <div className={styles.balanceValue}>
            {balance.toLocaleString()} <span className={styles.gold}>💰</span>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Quick Actions</h2>
        </div>
        <div className={styles.quickActions}>
          <Link href="/games/slots" passHref>
            <Button fullWidth>🎰 Play Slots</Button>
          </Link>
          <Link href="/quests" passHref>
            <Button variant="secondary" fullWidth>⭐ Daily Quests</Button>
          </Link>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Featured Games</h2>
          <Link href="/games" className={styles.seeAll}>See All</Link>
        </div>
        <div className={styles.gamesGrid}>
          {["Slots", "Coin Flip", "Dice", "Crash"].map((game, i) => (
            <Link href={`/games/${game.toLowerCase().replace(" ", "-")}`} key={i} className={styles.gameCard}>
              <div className={styles.gameIcon}>游戏</div>
              <div className={styles.gameName}>{game}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
