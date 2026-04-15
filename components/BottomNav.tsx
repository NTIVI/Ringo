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
        <span className={styles.label}>TAP</span>
        <div className={styles.indicator} />
      </button>

      <button 
        className={`${styles.navItem} ${currentTab === 'shop' ? styles.active : ''}`}
        onClick={() => setCurrentTab('shop')}
      >
        <span className={styles.label}>STORE</span>
        <div className={styles.indicator} />
      </button>

      <button 
        className={`${styles.navItem} ${currentTab === 'leaderboard' ? styles.active : ''}`}
        onClick={() => setCurrentTab('leaderboard')}
      >
        <span className={styles.label}>RANK</span>
        <div className={styles.indicator} />
      </button>
    </div>
  );
}
