"use client";

import React from "react";
import Link from "next/link";
import styles from "./page.module.css";

const GAMES = [
  { id: "slots", name: "Slots", icon: "🎰" },
  { id: "coin-flip", name: "Coin Flip", icon: "🪙" },
  { id: "dice", name: "Dice", icon: "🎲" },
  { id: "wheel", name: "Wheel of Fortune", icon: "🎡" },
  { id: "crash", name: "Crash", icon: "🚀" },
//  { id: "hi-lo", name: "Hi-Lo", icon: "🃏" },
//  { id: "blackjack", name: "Blackjack", icon: "♠️" },
//  { id: "roulette", name: "Roulette", icon: "🎡" },
//  { id: "mines", name: "Mines", icon: "💣" },
//  { id: "plinko", name: "Plinko", icon: "🎯" },
];

export default function Games() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>All Games</h1>
      
      <div className={styles.grid}>
        {GAMES.map(game => (
          <Link href={`/games/${game.id}`} key={game.id} className={styles.card}>
            <div className={styles.icon}>{game.icon}</div>
            <h3 className={styles.name}>{game.name}</h3>
          </Link>
        ))}
      </div>
    </div>
  );
}
