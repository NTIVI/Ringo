"use client";

import { useState } from 'react';
import styles from './Shop.module.css';

type StoreType = 'hub' | 'food' | 'prizes' | 'coupons';

export default function Shop({ onClose, balance, setBalance, setMultiplier, currentDonutId }: { 
  onClose: () => void; 
  balance: number;
  setBalance: (b: number) => void;
  setMultiplier: (m: number) => void;
  currentDonutId: number;
}) {
  const [activeStore, setActiveStore] = useState<StoreType>('hub');

  const buyDonut = async (id: number, price: number, mult: number) => {
    if (balance < price) return;
    
    // In a real app, this would be an API call
    // For now, update local state
    setBalance(balance - price);
    setMultiplier(mult);
    alert(`Пончик куплен! Теперь вы получаете x${mult} очков!`);
  };

  const renderHub = () => (
    <div className={styles.hubContainer}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 className={styles.mainTitle}>Магазины</h2>
        <button className={styles.closeBtn} onClick={onClose}>Закрыть</button>
      </div>
      <p className={styles.subTitle}>Выберите категорию товаров</p>
      
      <div className={styles.hubGrid}>
        <div className={styles.hubCard} onClick={() => setActiveStore('food')}>
          <div className={styles.hubIcon}>🍩</div>
          <h3>Пончики & Еда</h3>
          <p>Увеличьте свой доход за клик</p>
        </div>
        
        <div className={`${styles.hubCard} ${styles.neonPink}`} onClick={() => setActiveStore('prizes')}>
          <div className={styles.hubIcon}>🎁</div>
          <h3>Магазин Призов</h3>
          <p>iPhone, наушники и гаджеты</p>
        </div>
        
        <div className={styles.hubCard} onClick={() => setActiveStore('coupons')}>
          <div className={styles.hubIcon}>🎟</div>
          <h3>Магазин Купонов</h3>
          <p>Скидки и бесплатные сеты</p>
        </div>
      </div>
    </div>
  );

  const renderFoodStore = () => (
    <div className={styles.storePage}>
      <div className={styles.storeHeader}>
        <button className={styles.backBtn} onClick={() => setActiveStore('hub')}>Назад</button>
        <h3>Пончики & Еда</h3>
      </div>

      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>🍩 Пончики (X-Мультипликатор)</h4>
        <div className={styles.horizontalScroll}>
          <div className={`${styles.itemCard} ${currentDonutId === 1 ? styles.activeCard : ''}`}>
            <div className={styles.itemImage}>🍩</div>
            <h5>Классический</h5>
            <div className={styles.multiplierBadge}>x1 Множитель</div>
            <div className={styles.priceTag}>В комплекте</div>
            <button className={styles.buyButton} disabled={currentDonutId === 1}>
              {currentDonutId === 1 ? 'Выбрано' : 'Выбрать'}
            </button>
          </div>

          <div className={`${styles.itemCard} ${currentDonutId === 2 ? styles.activeCard : ''}`}>
            <div className={styles.itemImage}>✨</div>
            <h5>Глазированный</h5>
            <div className={styles.multiplierBadge}>x2 Множитель</div>
            <div className={styles.priceTag}>10,000 RNG</div>
            <button className={styles.buyButton} onClick={() => buyDonut(2, 10000, 2)}>
              Купить
            </button>
          </div>

          <div className={`${styles.itemCard} ${currentDonutId === 3 ? styles.activeCard : ''}`}>
            <div className={styles.itemImage}>🌌</div>
            <h5>Космический</h5>
            <div className={styles.multiplierBadge}>x5 Множитель</div>
            <div className={styles.priceTag}>100,000 RNG</div>
            <button className={styles.buyButton} onClick={() => buyDonut(3, 100000, 5)}>
              Купить
            </button>
          </div>

          <div className={`${styles.itemCard} ${currentDonutId === 4 ? styles.activeCard : ''}`}>
            <div className={styles.itemImage}>👑</div>
            <h5>Золотой</h5>
            <div className={styles.multiplierBadge}>x10 Множитель</div>
            <div className={styles.priceTag}>1,000,000 RNG</div>
            <button className={styles.buyButton} onClick={() => buyDonut(4, 1000000, 10)}>
              Купить
            </button>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>🌭 Перекусы</h4>
        <div className={styles.horizontalScroll}>
          <div className={styles.itemCard}>
            <div className={styles.itemImage}>🥟</div>
            <h5>Чебурек</h5>
            <div className={styles.priceTag}>10,000 RNG</div>
            <button className={styles.buyButton}>Купить</button>
          </div>
          <div className={styles.itemCard}>
            <div className={styles.itemImage}>🌭</div>
            <h5>Хот-дог</h5>
            <div className={styles.priceTag}>25,000 RNG</div>
            <button className={styles.buyButton}>Купить</button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPrizeStore = () => (
    <div className={styles.storePage}>
      <div className={styles.storeHeader}>
        <button className={styles.backBtn} onClick={() => setActiveStore('hub')}>Назад</button>
        <h3>Реальные Призы</h3>
      </div>
      <div className={styles.gridList}>
        <div className={`${styles.itemCardFull} ${styles.neonBorder}`}>
          <div className={styles.itemImageWide}>📱</div>
          <div className={styles.itemInfo}>
            <h5>iPhone 15 Pro</h5>
            <p>Доставка в любую точку Армении</p>
            <div className={styles.priceTag}>100,000,000 RNG</div>
            <button className={styles.buyButtonWide}>🛒 Купить</button>
          </div>
        </div>
        <div className={styles.itemCardFull}>
          <div className={styles.itemImageWide}>🎧</div>
          <div className={styles.itemInfo}>
            <h5>AirPods Max</h5>
            <p>Премиальный звук за RNG</p>
            <div className={styles.priceTag}>40,000,000 RNG</div>
            <button className={styles.buyButtonWide}>🛒 Купить</button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCouponStore = () => (
    <div className={styles.storePage}>
      <div className={styles.storeHeader}>
        <button className={styles.backBtn} onClick={() => setActiveStore('hub')}>Назад</button>
        <h3>Купоны на еду</h3>
      </div>
      <div className={styles.gridList}>
        <div className={styles.itemCardFull}>
          <div className={styles.itemImageWide}>🎟</div>
          <div className={styles.itemInfo}>
            <h5>Скидка 15%</h5>
            <p>На всё меню в заведениях сети</p>
            <div className={styles.priceTag}>150,000 RNG</div>
            <button className={styles.buyButtonWide}>🎫 Взять</button>
          </div>
        </div>
        <div className={styles.itemCardFull}>
          <div className={styles.itemImageWide}>🍔</div>
          <div className={styles.itemInfo}>
            <h5>Бесплатный Сет</h5>
            <p>Сытный обед за ваши клики</p>
            <div className={styles.priceTag}>2,000,000 RNG</div>
            <button className={styles.buyButtonWide}>🎫 Взять</button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={styles.shopOverlay}>
      {activeStore === 'hub' && renderHub()}
      {activeStore === 'food' && renderFoodStore()}
      {activeStore === 'prizes' && renderPrizeStore()}
      {activeStore === 'coupons' && renderCouponStore()}
    </div>
  );
}
