"use client";

import React, { useState } from "react";
import styles from "./page.module.css";
import { Button } from "@/components/Button";
import { useAppContext } from "@/context/AppProvider";

export default function CoinFlip() {
  const { balance, setBalance, user } = useAppContext();
  const [betAmount, setBetAmount] = useState(10);
  const [flipping, setFlipping] = useState(false);
  const [result, setResult] = useState<"heads" | "tails" | null>(null);
  const [win, setWin] = useState<boolean | null>(null);
  const [winAmount, setWinAmount] = useState(0);

  const handleFlip = async (guess: "heads" | "tails") => {
    if (!user || user.id === undefined) return;
    if (balance < betAmount) {
      alert("Insufficient balance!");
      return;
    }

    setFlipping(true);
    setResult(null);
    setWin(null);

    try {
      const res = await fetch("/api/games/coin-flip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tgId: user.id.toString(),
          betAmount,
          guess,
        }),
      });

      const data = await res.json();
      
      // Simulate coin flip animation time
      setTimeout(() => {
        if (data.success) {
          setResult(data.result);
          setWin(data.win);
          setWinAmount(data.winAmount);
          setBalance(data.newBalance);
        } else {
          alert(data.error);
        }
        setFlipping(false);
      }, 2000);
    } catch (e) {
      console.error(e);
      setFlipping(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Coin Flip</h1>
      
      <div className={styles.coinContainer}>
        <div className={`${styles.coin} ${flipping ? styles.flipping : ""} ${result ? styles[result] : ""}`}>
          <div className={`${styles.face} ${styles.heads}`}>H</div>
          <div className={`${styles.face} ${styles.tails}`}>T</div>
        </div>
      </div>

      {!flipping && win !== null && (
        <div className={`${styles.resultBanner} ${win ? styles.win : styles.lose}`}>
          {win ? `You WON ${winAmount} 💰!` : "You LOST!"}
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

        <div className={styles.actionButtons}>
          <Button 
            disabled={flipping || balance < betAmount} 
            fullWidth 
            onClick={() => handleFlip("heads")}
          >
            Bet Heads
          </Button>
          <Button 
            disabled={flipping || balance < betAmount} 
            fullWidth 
            variant="secondary"
            onClick={() => handleFlip("tails")}
          >
            Bet Tails
          </Button>
        </div>
      </div>
    </div>
  );
}
