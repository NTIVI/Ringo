"use client";

import styles from './BottomNav.module.css';

interface BottomNavProps {
  currentTab: 'tap' | 'shop' | 'leaderboard' | 'profile';
  setCurrentTab: (tab: 'tap' | 'shop' | 'leaderboard' | 'profile') => void;
}

export default function BottomNav({ currentTab, setCurrentTab }: BottomNavProps) {
  return (
    <div className={styles.bottomNav}>
      <button 
        className={`${styles.navItem} ${currentTab === 'tap' ? styles.active : ''}`}
        onClick={() => setCurrentTab('tap')}
      >
        <div className={styles.iconContainer}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
        </div>
        <span className={styles.label}>Старт</span>
      </button>

      <button 
        className={`${styles.navItem} ${currentTab === 'shop' ? styles.active : ''}`}
        onClick={() => setCurrentTab('shop')}
      >
        <div className={styles.iconContainer}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
        </div>
        <span className={styles.label}>Магазин</span>
      </button>

      <button 
        className={`${styles.navItem} ${currentTab === 'leaderboard' ? styles.active : ''}`}
        onClick={() => setCurrentTab('leaderboard')}
      >
        <div className={styles.iconContainer}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 21h8"></path><path d="M12 17v4"></path><path d="M7 4h10l3 5-8 8-8-8 3-5"></path></svg>
        </div>
        <span className={styles.label}>Топ</span>
      </button>

      <button 
        className={`${styles.navItem} ${currentTab === 'profile' ? styles.active : ''}`}
        onClick={() => setCurrentTab('profile')}
      >
        <div className={styles.iconContainer}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
        </div>
        <span className={styles.label}>Профиль</span>
      </button>
    </div>
  );
}
