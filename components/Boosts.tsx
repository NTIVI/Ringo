"use client";

import { useState } from 'react';
import styles from './Boosts.module.css';

export default function Boosts({ balance, setBalance }: { balance: number; setBalance: (v: any) => void }) {
  const [isAdLoading, setIsAdLoading] = useState(false);

  const handleBoost = (multiplier: number) => {
    setIsAdLoading(true);
    setTimeout(() => {
      setIsAdLoading(false);
      alert(`🚀 Акселератор x${multiplier} активирован на 30 секунд!`);
    }, 2000);
  };

  return (
    <div className={styles.boostsContainer}>
      <h2 className="title">Бусты</h2>
      <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: 5, marginBottom: 30 }}>
        Ускорь свой прогресс до максимума
      </p>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>⚡ Прокачка</h3>
        <div className={styles.grid}>
          <div className={`${styles.card} ${styles.neonBorder}`}>
            <div className={styles.icon}>💪</div>
            <div className={styles.info}>
              <h4>Сила клика</h4>
              <p>Lvl 1 — +1 монета</p>
            </div>
            <button className={styles.buyBtn}>1,000 RNG</button>
          </div>

          <div className={styles.card}>
            <div className={styles.icon}>🔋</div>
            <div className={styles.info}>
              <h4>Энергия</h4>
              <p>Lvl 5 — 150 макс.</p>
            </div>
            <button className={styles.buyBtn}>2,500 RNG</button>
          </div>

          <div className={styles.card}>
            <div className={styles.icon}>⚡</div>
            <div className={styles.info}>
              <h4>Регенерация</h4>
              <p>Lvl 2 — 2/сек</p>
            </div>
            <button className={styles.buyBtn}>5,000 RNG</button>
          </div>
        </div>
      </section>

      <section className={styles.section} style={{ marginTop: 40 }}>
        <h3 className={styles.sectionTitle}>🚀 Супер Бонусы</h3>
        <div className={styles.grid}>
          <div className={styles.card}>
            <div className={styles.icon}>📺</div>
            <div className={styles.info}>
              <h4>Множитель x2</h4>
              <p>За просмотр рекламы</p>
            </div>
            <button className={styles.adBtn} onClick={() => handleBoost(2)}>Смотреть</button>
          </div>

          <div className={`${styles.card} ${styles.neonBorder}`}>
            <div className={styles.icon}>💎</div>
            <div className={styles.info}>
              <h4>Множитель x5</h4>
              <p>За просмотр рекламы</p>
            </div>
            <button className={styles.adBtn} onClick={() => handleBoost(5)}>Смотреть</button>
          </div>
        </div>
      </section>
      
      {isAdLoading && (
        <div className={styles.loadingOverlay}>
          <div className={styles.spinner}></div>
          <p>Загрузка рекламы...</p>
        </div>
      )}
    </div>
  );
}
