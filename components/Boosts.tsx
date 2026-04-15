"use client";

import { useState } from 'react';
import styles from './Boosts.module.css';

export default function Boosts({ balance, setBalance }: { balance: number; setBalance: (v: any) => void }) {
  const [isAdLoading, setIsAdLoading] = useState(false);

  const handleDailyBonus = async () => {
    try {
      // Get telegramId from global window if possible, for now using test
      const telegramId = (window as any).Telegram?.WebApp?.initDataUnsafe?.user?.id?.toString() || 'test_user_1';
      const res = await fetch('/api/daily-bonus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ telegramId })
      });
      const data = await res.json();
      if (res.ok) {
        alert(`🎁 Поздравляем! Вы получили ${data.reward} RNG!`);
        setBalance((prev: number) => prev + data.reward);
      } else {
        alert(`❌ Ошибка: ${data.error}. Попробуйте через ${data.retryIn || 'некоторое время'}.`);
      }
    } catch (e) {
      alert("Ошибка сети");
    }
  };

  return (
    <div className={styles.boostsContainer}>
      <h2 className="title">Бонусы & Бусты</h2>
      <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: 5, marginBottom: 30 }}>
        Получай награды каждый день
      </p>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>🎁 Ежедневные Подарки</h3>
        <div className={styles.card} style={{ border: '1px solid var(--accent-gold)', boxShadow: '0 0 15px rgba(255, 215, 0, 0.1)' }}>
          <div className={styles.icon}>💰</div>
          <div className={styles.info}>
            <h4>Daily Check-in</h4>
            <p>Забирай 5,000 RNG каждые 24ч</p>
          </div>
          <button className={styles.adBtn} onClick={handleDailyBonus} style={{ background: 'var(--accent-gold)', color: '#000' }}>Забрать</button>
        </div>
      </section>

      <section className={styles.section} style={{ marginTop: 30 }}>
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
