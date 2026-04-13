"use client";

import React, { useState } from "react";
import styles from "./page.module.css";
import { Button } from "@/components/Button";
import { useAppContext } from "@/context/AppProvider";

export default function WheelOfFortune() {
  const { balance, setBalance, user } = useAppContext();
  const [betAmount, setBetAmount] = useState(50);
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [winAmount, setWinAmount] = useState<number | null>(null);

  const handleSpin = async () => {
    if (!user || user.id === undefined) return;
    if (balance < betAmount) {
      alert("Insufficient balance!");
      return;
    }

    setSpinning(true);
    setWinAmount(null);

    try {
      const res = await fetch("/api/games/wheel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tgId: user.id.toString(), betAmount }),
      });

      const data = await res.json();
      
      if (data.success) {
        // Compute spin
        const segments = 6;
        const segmentAngle = 360 / segments;
        // Target index logic
        const targetAngle = 360 - (data.index * segmentAngle);
        const spins = 5 * 360; // 5 full spins
        const finalRotation = rotation + spins + targetAngle - (rotation % 360);

        setRotation(finalRotation);

        setTimeout(() => {
          setWinAmount(data.winAmount);
          setBalance(data.newBalance);
          setSpinning(false);
        }, 3000);
      } else {
        alert(data.error);
        setSpinning(false);
      }
    } catch (e) {
      setSpinning(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Wheel of Fortune</h1>
      
      <div className={styles.wheelContainer}>
        <div className={styles.pointer}>▼</div>
        <div 
          className={styles.wheel} 
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          <div className={`${styles.segment} ${styles.s1}`}>10x</div>
          <div className={`${styles.segment} ${styles.s2}`}>5x</div>
          <div className={`${styles.segment} ${styles.s3}`}>2x</div>
          <div className={`${styles.segment} ${styles.s4}`}>1x</div>
          <div className={`${styles.segment} ${styles.s5}`}>0.5x</div>
          <div className={`${styles.segment} ${styles.s6}`}>0.1x</div>
        </div>
      </div>

      {!spinning && winAmount !== null && (
        <div className={`${styles.resultBanner} ${winAmount > betAmount ? styles.winBanner : styles.loseBanner}`}>
          {winAmount > betAmount ? `You WON ${winAmount} 💰!` : `You got ${winAmount} 💰`}
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
