"use client";

import styles from './BottomNav.module.css';

interface BottomNavProps {
  currentTab: 'tap' | 'shop' | 'leaderboard';
  setCurrentTab: (tab: 'tap' | 'shop' | 'leaderboard') => void;
}

export default function BottomNav({ currentTab, setCurrentTab }: BottomNavProps) {
  return (
    <div className={styles.bottomNav}>
      <button 
        className={`${styles.navItem} ${currentTab === 'tap' ? styles.active : ''}`}
        onClick={() => setCurrentTab('tap')}
      >
        <div className={styles.iconContainer}>
          <span className={styles.icon}>🍩</span>
        </div>
        <span className={styles.label}>Клик</span>
      </button>

      <button 
        className={`${styles.navItem} ${currentTab === 'shop' ? styles.active : ''}`}
        onClick={() => setCurrentTab('shop')}
      >
        <div className={styles.iconContainer}>
          <span className={styles.icon}>🏪</span>
        </div>
        <span className={styles.label}>Магазин</span>
      </button>

      <button 
        className={`${styles.navItem} ${currentTab === 'leaderboard' ? styles.active : ''}`}
        onClick={() => setCurrentTab('leaderboard')}
      >
        <div className={styles.iconContainer}>
          <span className={styles.icon}>🏆</span>
        </div>
        <span className={styles.label}>Топ</span>
      </button>
    </div>
  );
}
