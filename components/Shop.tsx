"use client";

import { useState } from 'react';
import styles from './Shop.module.css';

export default function Shop({ onClose, balance }: { onClose: () => void; balance: number }) {
  const [isAdLoading, setIsAdLoading] = useState(false);

  const handleBoost = (multiplier: number) => {
    setIsAdLoading(true);
    setTimeout(() => {
      setIsAdLoading(false);
      alert(`🎉 Реклама просмотрена! Множитель x${multiplier} активирован на 30 секунд!`);
    }, 3000);
  };

  return (
    <div className={styles.shopContainer}>
      <div className={styles.header}>
        <h2 className={styles.mainTitle}>Магазин</h2>
        <p className={styles.subTitle}>Выбирай лучшее за свои достижения.</p>
      </div>
      
      {/* Пончики */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>🍩 Вкусные Пончики</h3>
        <div className={styles.horizontalScroll}>
          <div className={styles.itemCard}>
            <div className={styles.imagePlaceholder}>🍩</div>
            <h4>Классический</h4>
            <div className={styles.price}>Куплено</div>
            <button className={styles.buyBtn} disabled>
               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
               Купить
            </button>
          </div>

          <div className={`${styles.itemCard} ${styles.activeCard}`}>
             <div className={styles.imagePlaceholder}>🍫</div>
             <h4>Шоколадный</h4>
             <div className={styles.price}>5,000 RNG</div>
             <button className={styles.buyBtn}>
               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
               Купить
             </button>
          </div>

          <div className={styles.itemCard}>
             <div className={styles.imagePlaceholder}>🍓</div>
             <h4>Клубничный</h4>
             <div className={styles.price}>50,000 RNG</div>
             <button className={styles.buyBtn}>
               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
               Купить
             </button>
          </div>
        </div>
      </div>

      {/* Гаджеты */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>📱 Телефоны и Гаджеты</h3>
        <div className={styles.horizontalScroll}>
          <div className={styles.itemCard}>
             <div className={styles.imagePlaceholder}>📱</div>
             <h4>iPhone 15 Pro</h4>
             <div className={styles.price}>100M RNG</div>
             <button className={styles.buyBtn}>
               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
               Купить
             </button>
          </div>

          <div className={`${styles.itemCard} ${styles.activeCard}`}>
             <div className={styles.imagePlaceholder}>📱</div>
             <h4>Xiaomi 14 Ultra</h4>
             <div className={styles.price}>80M RNG</div>
             <button className={styles.buyBtn}>
               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
               Купить
             </button>
          </div>
          
          <div className={styles.itemCard}>
             <div className={styles.imagePlaceholder}>🎮</div>
             <h4>PlayStation 5</h4>
             <div className={styles.price}>70M RNG</div>
             <button className={styles.buyBtn}>
               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
               Купить
             </button>
          </div>
        </div>
      </div>

       {/* Прокачка */}
       <div className={styles.section}>
        <h3 className={styles.sectionTitle}>⚡ Прокачка</h3>
        <div className={styles.horizontalScroll}>
          <div className={styles.itemCard}>
             <div className={styles.imagePlaceholder}>💪</div>
             <h4>Сила клика</h4>
             <div className={styles.price}>1,000 RNG</div>
             <button className={styles.buyBtn}>
               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
               Купить
             </button>
          </div>

          <div className={styles.itemCard}>
             <div className={styles.imagePlaceholder}>🔋</div>
             <h4>Макс. Энергия</h4>
             <div className={styles.price}>2,500 RNG</div>
             <button className={styles.buyBtn}>
               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
               Купить
             </button>
          </div>
        </div>
      </div>

    </div>
  );
}
