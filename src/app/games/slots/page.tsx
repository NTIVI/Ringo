"use client";

import React, { useState } from "react";
import styles from "./page.module.css";
import { Button } from "@/components/Button";
import { useAppContext } from "@/context/AppProvider";

const SYMBOLS = ["🍒", "🍋", "🍉", "⭐", "💎", "🍒", "🍋", "🍉", "⭐", "💎"];

export default function Slots() {
  const { balance, setBalance, user } = useAppContext();
  const [betAmount, setBetAmount] = useState(10);
  const [spinning, setSpinning] = useState(false);
  const [reels, setReels] = useState<string[]>(["⭐", "⭐", "⭐"]);
  const [win, setWin] = useState<boolean | null>(null);
  const [winAmount, setWinAmount] = useState(0);

  const handleSpin = async () => {
    if (!user || user.id === undefined) return;
    if (balance < betAmount) {
      alert("Insufficient balance!");
      return;
    }

    setSpinning(true);
    setWin(null);

    // Initial rolling animation simulation
    let tick = 0;
    const interval = setInterval(() => {
      setReels([
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
      ]);
      tick++;
      if (tick > 30) clearInterval(interval);
    }, 50);

    try {
      const res = await fetch("/api/games/slots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tgId: user.id.toString(),
          betAmount,
        }),
      });

      const data = await res.json();
      
      setTimeout(() => {
        clearInterval(interval);
        if (data.success) {
          setReels(data.result);
          setWin(data.win);
          setWinAmount(data.winAmount);
          setBalance(data.newBalance);
        } else {
          alert(data.error);
        }
        setSpinning(false);
      }, 1500); // 1.5s animation
    } catch (e) {
      clearInterval(interval);
      console.error(e);
      setSpinning(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Classic Slots</h1>
      
      <div className={styles.slotMachine}>
        <div className={styles.reelsContainer}>
          {reels.map((symbol, index) => (
            <div key={index} className={`${styles.reel} ${spinning ? styles.spinning : ""}`}>
              <div className={styles.symbol}>{symbol}</div>
            </div>
          ))}
        </div>
        <div className={styles.payline}></div>
      </div>

      {!spinning && win !== null && (
        <div className={`${styles.resultBanner} ${win ? styles.winBanner : styles.loseBanner}`}>
          {win ? `JACKPOT! You WON ${winAmount} 💰!` : "Try Again!"}
        </div>
      )}

      <div className={styles.controls}>
        <div className={styles.betControl}>
          <label>Bet Amount:</label>
          <div className={styles.betGroup}>
            <button onClick={() => setBetAmount(Math.max(10, betAmount - 10))}>-</button>
            <input 
              type="number" 
              value={betAmount} 
              onChange={(e) => setBetAmount(Number(e.target.value))}
              className={styles.betInput}
            />
            <button onClick={() => setBetAmount(betAmount + 10)}>+</button>
          </div>
        </div>

        <Button 
          disabled={spinning || balance < betAmount} 
          fullWidth 
          onClick={handleSpin}
        >
          {spinning ? "Spinning..." : "SPIN 🎰"}
        </Button>
      </div>
    </div>
  );
}
