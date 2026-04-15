"use client";

import { useState, useEffect } from 'react';
import DonutClicker from '@/components/DonutClicker';
import Shop from '@/components/Shop';
import BottomNav from '@/components/BottomNav';
import Boosts from '@/components/Boosts';

export default function Home() {
  const [balance, setBalance] = useState(0);
  const [stamina, setStamina] = useState(100);
  const maxStamina = 100;
  const [currentTab, setCurrentTab] = useState<'tap' | 'boosts' | 'shop' | 'leaderboard' | 'profile'>('tap');

  useEffect(() => {
    // Mock user login and load data
    const loadUser = async () => {
      try {
        const res = await fetch('/api/user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ telegramId: 'test_user_1', name: 'Player One' })
        });
        const data = await res.json();
        if (data && data.balance !== undefined) {
          setBalance(data.balance);
          setStamina(Math.min(data.stamina, maxStamina));
        }
      } catch (err) {
        console.error("Failed to load user", err);
      }
    };
    loadUser();
  }, []);

  // Background Sync
  useEffect(() => {
    const syncInterval = setInterval(() => {
      fetch('/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          telegramId: 'test_user_1', 
          balanceTotal: balance, 
          staminaTotal: stamina, 
          donutsClicked: 0 
        })
      }).catch(console.error);
    }, 5000);
    return () => clearInterval(syncInterval);
  }, [balance, stamina]);

  return (
    <main style={{ display: 'flex', flexDirection: 'column', height: '100vh', justifyContent: 'flex-start', paddingTop: 20 }}>
      
      {currentTab === 'tap' && (
        <div style={{ margin: '10px 20px', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', fontWeight: '800', color: '#fff', letterSpacing: '1px' }}>
            {Math.floor(balance).toLocaleString()} <span style={{fontSize: '1.5rem', color: 'var(--accent-gold)'}}>RNG</span>
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '600', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '2px' }}>
            Текущий Баланс
          </div>
        </div>
      )}

      {currentTab === 'tap' && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, justifyContent: 'center', paddingBottom: 40 }}>
          <DonutClicker 
            balance={balance} 
            setBalance={setBalance}
            stamina={stamina}
            setStamina={setStamina}
            maxStamina={maxStamina}
          />
        </div>
      )}

      {currentTab === 'boosts' && (
        <div style={{ flex: 1, overflowY: 'auto', padding: '10px' }}>
          <Boosts balance={balance} setBalance={setBalance} />
        </div>
      )}

      {currentTab === 'shop' && (
        <div style={{ flex: 1, overflowY: 'auto', padding: '10px' }}>
          <Shop onClose={() => setCurrentTab('tap')} balance={balance} />
        </div>
      )}
      
      {currentTab === 'leaderboard' && (
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
           <div className="glass-panel" style={{ padding: 20 }}>
              <h2 className="title">Лидерборд</h2>
              <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginTop: 10 }}>Данные синхронизируются...</p>
           </div>
        </div>
      )}

      {currentTab === 'profile' && (
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
           <div className="glass-panel" style={{ padding: '30px 20px', textAlign: 'center' }}>
              <div style={{ width: 80, height: 80, borderRadius: '40px', background: 'var(--btn-gradient)', margin: '0 auto 15px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>
                👤
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#fff', marginBottom: 5 }}>Player One</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 25 }}>ID: 123456789</p>

              <div style={{ background: 'rgba(0,0,0,0.3)', padding: 15, borderRadius: 12, marginBottom: 20 }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: 1 }}>Заработано всего</div>
                <div style={{ fontSize: '1.5rem', color: 'var(--accent-gold)', fontWeight: 800 }}>{Math.floor(balance).toLocaleString()} RNG</div>
              </div>

              <button className="button" style={{ width: '100%' }}>
                Подключить Кошелек
              </button>
           </div>
        </div>
      )}

      <BottomNav currentTab={currentTab} setCurrentTab={setCurrentTab} />
    </main>
  );
}
