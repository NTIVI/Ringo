"use client";

import styles from './BottomNav.module.css';

interface BottomNavProps {
  currentTab: 'tap' | 'boosts' | 'shop' | 'leaderboard' | 'profile';
  setCurrentTab: (tab: 'tap' | 'boosts' | 'shop' | 'leaderboard' | 'profile') => void;
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
        className={`${styles.navItem} ${currentTab === 'boosts' ? styles.active : ''}`}
        onClick={() => setCurrentTab('boosts')}
      >
        <div className={styles.iconContainer}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-3.05 11a22.3 22.3 0 0 1-3.95 2z"></path><path d="M9 12H4s.55-3.03 2-4.5c1.1.9 2 2.5 2 4.5z"></path><path d="M12 15v5c-1.47-1.45-3.03-3-4.5-2 1.5-1.5 3-2.5 4.5-3z"></path></svg>
        </div>
        <span className={styles.label}>Бусты</span>
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
