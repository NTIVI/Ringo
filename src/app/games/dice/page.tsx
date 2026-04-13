"use client";

import React, { useState, useEffect } from "react";
import styles from "./page.module.css";
import { Button } from "@/components/Button";
import { useAppContext } from "@/context/AppProvider";

export default function Dice() {
  const { balance, setBalance, user } = useAppContext();
  const [betAmount, setBetAmount] = useState(10);
  const [target, setTarget] = useState(50);
  const [condition, setCondition] = useState<"over" | "under">("over");
  const [rolling, setRolling] = useState(false);
  const [rollResult, setRollResult] = useState<number | null>(null);
  const [win, setWin] = useState<boolean | null>(null);
  const [winAmount, setWinAmount] = useState(0);

  const calculateMultiplier = () => {
    return condition === "over" ? (99 / (100 - target)).toFixed(2) : (99 / target).toFixed(2);
  };

  const handleRoll = async () => {
    if (!user || user.id === undefined) return;
    if (balance < betAmount) {
      alert("Insufficient balance!");
      return;
    }

    setRolling(true);
    setRollResult(null);
    setWin(null);

    // Initial rolling animation simulation
    let tick = 0;
    const interval = setInterval(() => {
      setRollResult(Math.floor(Math.random() * 100) + 1);
      tick++;
      if (tick > 20) clearInterval(interval);
    }, 50);

    try {
      const res = await fetch("/api/games/dice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tgId: user.id.toString(),
          betAmount,
          target,
          condition,
        }),
      });

      const data = await res.json();
      
      setTimeout(() => {
        clearInterval(interval);
        if (data.success) {
          setRollResult(data.roll);
          setWin(data.win);
          setWinAmount(data.winAmount);
          setBalance(data.newBalance);
        } else {
          alert(data.error);
        }
        setRolling(false);
      }, 1000); // 1s animation
    } catch (e) {
      clearInterval(interval);
      console.error(e);
      setRolling(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Dice Roll</h1>
      
      <div className={styles.rollDisplay}>
        <div className={`${styles.rollNumber} ${rolling ? styles.rolling : ""} ${win !== null ? (win ? styles.winText : styles.loseText) : ""}`}>
          {rollResult !== null ? rollResult : "-"}
        </div>
      </div>

      {!rolling && win !== null && (
        <div className={`${styles.resultBanner} ${win ? styles.winBanner : styles.loseBanner}`}>
          {win ? `You WON ${winAmount} 💰!` : "You LOST!"}
        </div>
      )}

      <div className={styles.sliderContainer}>
        <div className={styles.targetInfo}>
          <span>Roll {condition === "over" ? "Over" : "Under"} {target}</span>
          <span>Payout: {calculateMultiplier()}x</span>
        </div>
        <input 
          type="range" 
          min="2" max="98" 
          value={target} 
          onChange={(e) => setTarget(Number(e.target.value))}
          className={styles.slider}
          disabled={rolling}
        />
        <div className={styles.conditionToggle}>
          <button className={condition === "under" ? styles.active : ""} onClick={() => setCondition("under")}>Under</button>
          <button className={condition === "over" ? styles.active : ""} onClick={() => setCondition("over")}>Over</button>
        </div>
      </div>

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
          disabled={rolling || balance < betAmount} 
          fullWidth 
          onClick={handleRoll}
        >
          Roll Dice
        </Button>
      </div>
    </div>
  );
}
