"use client";

import React, { useState } from "react";
import styles from "./page.module.css";
import { Button } from "@/components/Button";
import { useAppContext } from "@/context/AppProvider";

const CARD_NAMES = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

export default function HiLo() {
  const { balance, setBalance, user } = useAppContext();
  const [betAmount, setBetAmount] = useState(10);
  const [playing, setPlaying] = useState(false);
  const [baseCard, setBaseCard] = useState(7);
  const [nextCard, setNextCard] = useState<number | null>(null);
  const [win, setWin] = useState<boolean | null>(null);
  const [winAmount, setWinAmount] = useState(0);

  const handlePlay = async (guess: "higher" | "lower") => {
    if (!user || user.id === undefined) return;
    if (balance < betAmount) {
      alert("Insufficient balance!");
      return;
    }

    setPlaying(true);
    setNextCard(null);
    setWin(null);

    try {
      const res = await fetch("/api/games/hi-lo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          tgId: user.id.toString(), 
          betAmount,
          guess,
          baseCard
        }),
      });

      const data = await res.json();
      
      if (data.success) {
        setTimeout(() => {
          setNextCard(data.nextCard);
          setWin(data.win);
          setWinAmount(data.winAmount);
          setBalance(data.newBalance);
          setPlaying(false);
          
          setTimeout(() => {
            setBaseCard(data.nextCard);
            setNextCard(null);
            setWin(null);
          }, 2000);
        }, 1000);
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
      <h1 className={styles.title}>Hi-Lo</h1>
      
      <div className={styles.cardsArea}>
        <div className={styles.card}>
          <div className={styles.cardRank}>{CARD_NAMES[baseCard - 1]}</div>
          <div className={styles.cardSuit}>♠️</div>
        </div>

        {nextCard !== null && (
          <div className={`${styles.card} ${styles.revealed}`}>
            <div className={styles.cardRank}>{CARD_NAMES[nextCard - 1]}</div>
            <div className={styles.cardSuit}>❤️</div>
          </div>
        )}
      </div>

      {!playing && win !== null && (
        <div className={`${styles.resultBanner} ${win ? styles.winBanner : styles.loseBanner}`}>
          {win ? `You WON ${winAmount} 💰!` : `You LOST!`}
        </div>
      )}

      <div className={styles.controls}>
        <div className={styles.betControl}>
          <label>Bet Amount</label>
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
            disabled={playing || balance < betAmount} 
            fullWidth 
            onClick={() => handlePlay("higher")}
          >
            Higher ⬆️
          </Button>
          <Button 
            disabled={playing || balance < betAmount} 
            fullWidth 
            variant="secondary"
            onClick={() => handlePlay("lower")}
          >
            Lower ⬇️
          </Button>
        </div>
      </div>
    </div>
  );
}
