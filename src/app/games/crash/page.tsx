"use client";

import React, { useState } from "react";
import styles from "./page.module.css";
import { Button } from "@/components/Button";
import { useAppContext } from "@/context/AppProvider";

export default function Crash() {
  const { balance, setBalance, user } = useAppContext();
  const [betAmount, setBetAmount] = useState(10);
  const [targetMultiplier, setTargetMultiplier] = useState(2.0);
  const [playing, setPlaying] = useState(false);
  const [currentMultiplier, setCurrentMultiplier] = useState(1.0);
  const [finalCrash, setFinalCrash] = useState<number | null>(null);
  const [win, setWin] = useState<boolean | null>(null);
  const [winAmount, setWinAmount] = useState(0);

  const handlePlay = async () => {
    if (!user || user.id === undefined) return;
    if (balance < betAmount) {
      alert("Insufficient balance!");
      return;
    }

    setPlaying(true);
    setFinalCrash(null);
    setWin(null);
    setCurrentMultiplier(1.0);

    try {
      const res = await fetch("/api/games/crash", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          tgId: user.id.toString(), 
          betAmount,
          targetMultiplier
        }),
      });

      const data = await res.json();
      
      if (data.success) {
        // Simulation loop
        let current = 1.0;
        const targetPoint = data.crashPoint;
        
        const interval = setInterval(() => {
          // Increase rate accelerates
          current += (current * 0.05) + 0.01;
          
          if (current >= targetPoint) {
            current = targetPoint;
            clearInterval(interval);
            setCurrentMultiplier(current);
            setFinalCrash(data.crashPoint);
            setWin(data.win);
            setWinAmount(data.winAmount);
            setBalance(data.newBalance);
            setPlaying(false);
          } else {
            setCurrentMultiplier(current);
          }
        }, 50);

      } else {
        alert(data.error);
        setPlaying(false);
      }
    } catch (e) {
      setPlaying(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Crash</h1>
      
      <div className={`${styles.graphContainer} ${finalCrash !== null ? (win ? styles.winBg : styles.loseBg) : ""}`}>
        <div className={styles.multiplierText}>
          {currentMultiplier.toFixed(2)}x
        </div>
        {finalCrash !== null && (
          <div className={styles.crashedText}>
            CRASHED @ {finalCrash.toFixed(2)}x
          </div>
        )}
      </div>

      {!playing && win !== null && (
        <div className={`${styles.resultBanner} ${win ? styles.winBanner : styles.loseBanner}`}>
          {win ? `You WON ${winAmount} 💰!` : `You LOST! (Target: ${targetMultiplier.toFixed(2)}x)`}
        </div>
      )}

      <div className={styles.controls}>
        <div className={styles.inputRow}>
          <div className={styles.inputControl}>
            <label>Bet Amount</label>
            <input 
              type="number" 
              value={betAmount} 
              onChange={(e) => setBetAmount(Number(e.target.value))}
              className={styles.input}
            />
          </div>
          <div className={styles.inputControl}>
            <label>Auto Cash Out</label>
            <input 
              type="number" 
              step="0.1"
              min="1.1"
              value={targetMultiplier} 
              onChange={(e) => setTargetMultiplier(Number(e.target.value))}
              className={styles.input}
            />
          </div>
        </div>

        <Button 
          disabled={playing || balance < betAmount} 
          fullWidth 
          onClick={handlePlay}
        >
          {playing ? "Flying..." : "PLACE BET 🚀"}
        </Button>
      </div>
    </div>
  );
}
