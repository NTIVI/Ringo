"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./DonutClicker.module.css";

interface FloatingCoin {
  id: number;
  x: number;
  y: number;
  amount: number;
}

export default function DonutClicker({
  balance,
  setBalance,
  stamina,
  setStamina,
  maxStamina,
  multiplier = 1,
}: {
  balance: number;
  setBalance: React.Dispatch<React.SetStateAction<number>>;
  stamina: number;
  setStamina: React.Dispatch<React.SetStateAction<number>>;
  maxStamina: number;
  multiplier?: number;
}) {
  const [coins, setCoins] = useState<FloatingCoin[]>([]);
  const [isJumping, setIsJumping] = useState(false);
  const clickCountRef = useRef(0);

  // Stamina regeneration
  useEffect(() => {
    const interval = setInterval(() => {
      setStamina((prev: number) => {
        if (prev < maxStamina) {
          return Math.min(prev + 1, maxStamina);
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [maxStamina, setStamina]);

  const handleTap = (e: React.MouseEvent | React.TouchEvent) => {
    if (stamina <= 0) return;

    // Trigger jump animation
    setIsJumping(true);
    setTimeout(() => setIsJumping(false), 150);

    // Calculate position for coin pop
    let clientX = 0;
    let clientY = 0;

    if ("touches" in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    const earned = 1 * multiplier;

    const newCoin: FloatingCoin = {
      id: Date.now() + Math.random(),
      x: clientX,
      y: clientY,
      amount: earned,
    };

    setCoins((prev) => [...prev, newCoin]);
    
    // Remove coin after animation
    setTimeout(() => {
      setCoins((prev) => prev.filter((c) => c.id !== newCoin.id));
    }, 800);

    // Update stats
    setBalance(balance + earned);
    setStamina(stamina - 1);
    clickCountRef.current += 1;
  };

  const staminaPercent = (stamina / maxStamina) * 100;

  return (
    <div className={styles.container}>
      {/* Stamina Bar */}
      <div className={styles.staminaWrapper}>
        <div className={styles.staminaBarContainer}>
          <div
            className={styles.staminaFill}
            style={{ width: `${staminaPercent}%` }}
          />
        </div>
        <div className={styles.staminaText}>
          {Math.floor(stamina)} / {maxStamina} ⚡
        </div>
      </div>

      {/* Donut Area */}
      <div
        className={`${styles.donutWrapper} ${isJumping ? "animate-jump" : ""}`}
        onPointerDown={handleTap}
        style={{ cursor: "pointer", transition: "transform 0.1s" }}
      >
        <img
          src="/premium_ringo.png"
          alt="Premium Ringo"
          className={styles.donutImage}
          draggable="false"
          style={{ width: "300px", height: "auto", filter: "drop-shadow(0 0 40px rgba(212, 175, 55, 0.4))", borderRadius: "50%" }}
        />
      </div>

      {/* Floating Coins */}
      {coins.map((coin) => (
        <div
          key={coin.id}
          className="floating-coin"
          style={{ left: coin.x - 20, top: coin.y - 20 }}
        >
          +{coin.amount}
        </div>
      ))}
    </div>
  );
}
