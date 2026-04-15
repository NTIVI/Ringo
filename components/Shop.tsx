"use client";

import { useState } from 'react';
import styles from './Shop.module.css';

type ShopCategory = 'Hub' | 'Food' | 'Upgrades' | 'Prizes' | 'Coupons' | 'Bonuses';

export default function Shop({ onClose, balance }: { onClose: () => void; balance: number }) {
  const [activeCategory, setActiveCategory] = useState<ShopCategory>('Hub');
  const [isAdLoading, setIsAdLoading] = useState(false);

  const handleBoost = (multiplier: number) => {
    setIsAdLoading(true);
    setTimeout(() => {
      setIsAdLoading(false);
      alert(`🎉 Реклама просмотрена! Множитель x${multiplier} активирован на 30 секунд!`);
    }, 3000);
  };

  const renderHub = () => (
    <div className={styles.hubGrid}>
      <button className={`${styles.hubButton} ${styles.bgFood}`} onClick={() => setActiveCategory('Food')}>
        🍩 <br/> Пончики & Еда
      </button>
      <button className={`${styles.hubButton} ${styles.bgUpgrades}`} onClick={() => setActiveCategory('Upgrades')}>
        ⚡ <br/> Прокачка
      </button>
      <button className={`${styles.hubButton} ${styles.bgPrizes}`} onClick={() => setActiveCategory('Prizes')}>
        🎁 <br/> Реальные Призы
      </button>
      <button className={`${styles.hubButton} ${styles.bgCoupons}`} onClick={() => setActiveCategory('Coupons')}>
        🍔 <br/> Купоны на еду
      </button>
      <button className={`${styles.hubButton} ${styles.bgBonuses}`} onClick={() => setActiveCategory('Bonuses')}>
        🚀 <br/> Супер Бонусы
      </button>
    </div>
  );

  const renderFood = () => (
    <div>
      <h3 style={{marginBottom: 10,  textAlign: 'left', fontWeight: 900}}>Пончики</h3>
      <div className={styles.horizontalScroll}>
        <div className={styles.itemCardSmall}>
          <div style={{fontSize: '3rem'}}>🍩</div>
          <h4>Классический</h4>
          <p>x1 за клик</p>
          <button className="button" style={{fontSize:'0.8rem', padding: '8px', minWidth: '100px'}} disabled>Куплено</button>
        </div>
        <div className={styles.itemCardSmall}>
          <div style={{fontSize: '3rem'}}>🍫</div>
          <h4>Шоколадный</h4>
          <p>x2 за клик</p>
          <button className="button" style={{fontSize:'0.8rem', padding: '8px', minWidth: '100px'}}>5,000</button>
        </div>
        <div className={styles.itemCardSmall}>
          <div style={{fontSize: '3rem'}}>🍓</div>
          <h4>Клубничный</h4>
          <p>x5 за клик</p>
          <button className="button" style={{fontSize:'0.8rem', padding: '8px', minWidth: '100px'}}>50,000</button>
        </div>
      </div>

      <h3 style={{marginBottom: 10, marginTop: 20, textAlign: 'left', fontWeight: 900}}>Сытные перекусы</h3>
      <div className={styles.horizontalScroll}>
        <div className={styles.itemCardSmall}>
          <div style={{fontSize: '3rem'}}>🥟</div>
          <h4>Чебурек</h4>
          <p>+50% Выносливость</p>
          <button className="button" style={{fontSize:'0.8rem', padding: '8px', minWidth: '100px'}}>10,000</button>
        </div>
        <div className={styles.itemCardSmall}>
          <div style={{fontSize: '3rem'}}>🌭</div>
          <h4>Хот-дог</h4>
          <p>+100% Выносливость</p>
          <button className="button" style={{fontSize:'0.8rem', padding: '8px', minWidth: '100px'}}>25,000</button>
        </div>
      </div>
    </div>
  );

  const renderUpgrades = () => (
    <div className={styles.grid}>
      <div className={styles.itemCard}>
        <h3>💪 Сила клика</h3>
        <p>Увеличивает базовый доход</p>
        <button className="button">1,000</button>
      </div>
      <div className={styles.itemCard}>
        <h3>🔋 Макс. Выносливость</h3>
        <p>Делает полоску энергии больше</p>
        <button className="button">2,500</button>
      </div>
      <div className={styles.itemCard}>
        <h3>⚡ Регенерация</h3>
        <p>Энергия восстанавливается быстрее</p>
        <button className="button">5,000</button>
      </div>
    </div>
  );

  const renderPrizes = () => (
    <div className={styles.grid}>
      <div className={styles.itemCard}>
        <h3>📱 iPhone 15 Pro</h3>
        <p>Забрать в реальном мире!</p>
        <button className="button" style={{background: '#ff1744'}}>100,000,000</button>
      </div>
      <div className={styles.itemCard}>
        <h3>🎮 PlayStation 5</h3>
        <p>Забрать в реальном мире!</p>
        <button className="button" style={{background: '#ff1744'}}>80,000,000</button>
      </div>
      <div className={styles.itemCard}>
        <h3>🎧 AirPods Pro</h3>
        <p>Забрать в реальном мире!</p>
        <button className="button" style={{background: '#ff1744'}}>30,000,000</button>
      </div>
    </div>
  );

  const renderCoupons = () => (
    <div className={styles.grid}>
      <div className={styles.itemCard}>
        <h3>🎟 Скидка 15%</h3>
        <p>В любом заведении сети в Армении</p>
        <button className="button">150,000</button>
      </div>
      <div className={styles.itemCard}>
        <h3>🎟 Скидка 25%</h3>
        <p>В любом заведении сети в Армении</p>
        <button className="button">300,000</button>
      </div>
      <div className={styles.itemCard}>
        <h3>🍔 Бесплатный Сет</h3>
        <p>Обменяй на кассе</p>
        <button className="button" style={{background: '#00e676'}}>2,000,000</button>
      </div>
    </div>
  );

  const renderBonuses = () => (
    <div className={styles.grid}>
      {isAdLoading ? (
        <div className={styles.loader}>Загрузка рекламы... 📺</div>
      ) : (
        <>
          <div className={styles.itemCard}>
            <h3>🔥 Буст x2 (30 сек)</h3>
            <p>Удвоение монет на 30 секунд</p>
            <button className="button" onClick={() => handleBoost(2)}>Посмотреть Рекламу</button>
          </div>
          <div className={styles.itemCard}>
            <h3>🚀 Буст x5 (30 сек)</h3>
            <p>Пятикратные монеты на 30 секунд</p>
            <button className="button" onClick={() => handleBoost(5)}>Посмотреть Рекламу</button>
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          {activeCategory !== 'Hub' && (
            <button className={styles.backBtn} onClick={() => setActiveCategory('Hub')}>
              ⬅ Назад
            </button>
          )}
          <h2 style={{flex: 1, textAlign: 'center'}}>
            {activeCategory === 'Hub' ? 'Магазин' : 
             activeCategory === 'Food' ? 'Еда & Пончики' :
             activeCategory === 'Upgrades' ? 'Прокачка' : 
             activeCategory === 'Prizes' ? 'Призы' : 
             activeCategory === 'Coupons' ? 'Купоны' : 'Бонусы'}
          </h2>
          {activeCategory !== 'Hub' && <div style={{width: 60}}></div> /* placeholder to center text */}
        </div>
        
        <div className={styles.content}>
          {activeCategory === 'Hub' && renderHub()}
          {activeCategory === 'Food' && renderFood()}
          {activeCategory === 'Upgrades' && renderUpgrades()}
          {activeCategory === 'Prizes' && renderPrizes()}
          {activeCategory === 'Coupons' && renderCoupons()}
          {activeCategory === 'Bonuses' && renderBonuses()}
        </div>
      </div>
    </div>
  );
}
