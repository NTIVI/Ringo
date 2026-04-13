"use client";
import React, { useState } from "react";
import styles from "./page.module.css";
import { Button } from "@/components/Button";
import { useAppContext } from "@/context/AppProvider";

export default function Roulette() {
  const { balance, setBalance, user } = useAppContext();
  const [betAmount, setBetAmount] = useState(10);
  const [playing, setPlaying] = useState(false);
  const [roll, setRoll] = useState<number | null>(null);
  const [resultColor, setResultColor] = useState<string | null>(null);
  const [win, setWin] = useState<boolean | null>(null);
  const [winAmount, setWinAmount] = useState(0);

  const handlePlay = async (betType: "red" | "black" | "green") => {
    if (!user || user.id === undefined) return;
    if (balance < betAmount) return;
    setPlaying(true); setWin(null);
    try {
      const res = await fetch("/api/games/roulette", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tgId: user.id.toString(), betAmount, betType }),
      });
      const data = await res.json();
      if (data.success) {
        setTimeout(() => {
          setRoll(data.roll); setResultColor(data.resultColor); setWin(data.win); setWinAmount(data.winAmount); setBalance(data.newBalance); setPlaying(false);
        }, 1500);
      } else { setPlaying(false); alert(data.error); }
    } catch { setPlaying(false); }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Roulette</h1>
      
      <div className={styles.wheel}>
        {roll !== null ? <div className={`${styles.number} ${styles[resultColor || "red"]}`}>{roll}</div> : <div className={`${styles.number} ${playing ? styles.spinning : ""}`}>?</div>}
      </div>

      {!playing && win !== null && (
        <div className={styles.result}>{win ? `WON ${winAmount}!` : "LOST!"}</div>
      )}

      <div className={styles.controls}>
        <input type="number" value={betAmount} onChange={(e) => setBetAmount(Number(e.target.value))} className={styles.input} />
        <div className={styles.bets}>
          <Button disabled={playing} onClick={() => handlePlay("red")} variant="danger">RED (2x)</Button>
          <Button disabled={playing} onClick={() => handlePlay("green")} style={{background: "#2ecc71"}}>GREEN (14x)</Button>
          <Button disabled={playing} onClick={() => handlePlay("black")} style={{background: "#000", border: "1px solid #333"}}>BLACK (2x)</Button>
        </div>
      </div>
    </div>
  );
}
