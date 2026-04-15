"use client";

import { useState } from 'react';
import styles from './Shop.module.css';

const TABS = ['Donuts', 'Upgrades', 'Boosts', 'Real Prizes', 'Coupons'];

export default function Shop({ onClose, balance }: { onClose: () => void; balance: number }) {
  const [activeTab, setActiveTab] = useState('Donuts');
  const [isAdLoading, setIsAdLoading] = useState(false);

  const handleBoost = (multiplier: number) => {
    setIsAdLoading(true);
    setTimeout(() => {
      setIsAdLoading(false);
      alert(`Watched Ad! You got x${multiplier} boost for 30 seconds!`);
      // TODO: implement boost logic in parent/context
    }, 3000);
  };

  const renderContent = () => {
    if (activeTab === 'Donuts') {
      return (
        <div className={styles.grid}>
          <div className={styles.itemCard}>
            <h3>Glazed Donut</h3>
            <p>Multiplier x1</p>
            <button className="button" disabled>Equipped</button>
          </div>
          <div className={styles.itemCard}>
            <h3>Chocolate Donut</h3>
            <p>Multiplier x2</p>
            <button className="button">Buy - 5,000</button>
          </div>
        </div>
      );
    }
    if (activeTab === 'Boosts') {
      return (
        <div className={styles.grid}>
          {isAdLoading ? (
            <div className={styles.loader}>Watching Ad...</div>
          ) : (
            <>
              <div className={styles.itemCard}>
                <h3>x2 Boost</h3>
                <p>Duration: 30s</p>
                <button className="button" onClick={() => handleBoost(2)}>Watch Ad</button>
              </div>
              <div className={styles.itemCard}>
                <h3>x3 Boost</h3>
                <p>Duration: 30s</p>
                <button className="button" onClick={() => handleBoost(3)}>Watch Ad</button>
              </div>
              <div className={styles.itemCard}>
                <h3>x5 Boost</h3>
                <p>Duration: 30s</p>
                <button className="button" onClick={() => handleBoost(5)}>Watch Ad</button>
              </div>
            </>
          )}
        </div>
      );
    }
    if (activeTab === 'Real Prizes') {
      return (
         <div className={styles.grid}>
          <div className={styles.itemCard}>
            <h3>iPhone 15</h3>
            <p>Real Life Prize</p>
            <button className="button">Buy - 50,000,000</button>
          </div>
          <div className={styles.itemCard}>
            <h3>PlayStation 5</h3>
            <p>Real Life Prize</p>
            <button className="button">Buy - 40,000,000</button>
          </div>
        </div>
      )
    }
    if (activeTab === 'Coupons') {
      return (
        <div className={styles.grid}>
          <div className={styles.itemCard}>
            <h3>Free Burger Coupon</h3>
            <p>Armenia network only</p>
            <button className="button">Buy - 500,000</button>
          </div>
        </div>
      )
    }
    return <div className={styles.empty}>Coming Soon</div>;
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>Shop</h2>
          <button className={styles.closeBtn} onClick={onClose}>&times;</button>
        </div>

        <div className={styles.balance}>Your Coins: {Math.floor(balance)}</div>

        <div className={styles.tabsContainer}>
          {TABS.map(tab => (
            <div 
              key={tab} 
              className={`${styles.tab} ${activeTab === tab ? styles.activeTab : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </div>
          ))}
        </div>

        <div className={styles.content}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
