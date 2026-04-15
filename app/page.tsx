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
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    // Mock user login and load data from Telegram WebApp
    const loadUser = async () => {
      try {
        const tg = (window as any).Telegram?.WebApp;
        const tgUser = tg?.initDataUnsafe?.user;
        
        const res = await fetch('/api/user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            telegramId: tgUser?.id?.toString() || 'test_user_1', 
            name: tgUser?.first_name || 'Player One',
            username: tgUser?.username,
            avatarUrl: tgUser?.photo_url
          })
        });
        const data = await res.json();
        if (reqOk(res, data)) {
          setUserData(data);
          setBalance(data.balance);
          setStamina(Math.min(data.stamina, maxStamina));
        }
      } catch (err) {
        console.error("Failed to load user", err);
      }
    };
    loadUser();
  }, []);

  const reqOk = (res: Response, data: any) => res.ok && data && !data.error;

  // Background Sync
  useEffect(() => {
    if (!userData) return;
    const syncInterval = setInterval(() => {
      fetch('/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          telegramId: userData.telegramId, 
          balanceTotal: balance, 
          staminaTotal: stamina, 
        })
      }).catch(console.error);
    }, 5000);
    return () => clearInterval(syncInterval);
  }, [balance, stamina, userData]);

  // Helper to filter and render purchases
  const renderPurchases = () => {
    const filtered = userData?.purchases?.filter((p: any) => p.type === 'COUPON' || p.type === 'PRIZE') || [];
    if (filtered.length === 0) return <p style={{ color: '#666', fontSize: '0.8rem' }}>История покупок пуста</p>;
    
    return filtered.map((p: any) => (
      <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <span style={{ fontSize: '0.9rem' }}>{p.type === 'COUPON' ? '🎟 Купон' : '🎁 Приз'}: {p.itemId}</span>
        <span style={{ color: 'var(--accent-gold)', fontSize: '0.9rem' }}>-{p.price} RNG</span>
      </div>
    ));
  };

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
              <div style={{ width: 100, height: 100, borderRadius: '50px', background: 'var(--btn-gradient)', margin: '0 auto 15px', position: 'relative', overflow: 'hidden', border: '3px solid var(--accent-neon)' }}>
                {userData?.avatarUrl ? (
                  <img src={userData.avatarUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ fontSize: '3rem', lineHeight: '100px' }}>👤</div>
                )}
                <div style={{ position: 'absolute', bottom: 0, right: 0, background: 'var(--accent-neon)', color: '#fff', fontSize: '0.7rem', padding: '2px 8px', borderRadius: '10px 0 0 0', fontWeight: 900 }}>
                  Lvl {userData?.level || 1}
                </div>
              </div>
              
              <h2 style={{ fontSize: '1.6rem', fontWeight: '900', color: '#fff', marginBottom: 2 }}>{userData?.name || 'Player One'}</h2>
              <p style={{ color: 'var(--accent-neon)', fontSize: '0.9rem', marginBottom: 15, fontWeight: 600 }}>@{userData?.username || 'user'}</p>

              {/* Level Progress Bar */}
              <div style={{ width: '100%', height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 3, marginBottom: 5, overflow: 'hidden' }}>
                <div style={{ width: `${(balance % 50000) / 500} %`, height: '100%', background: 'var(--accent-neon)', boxShadow: '0 0 10px var(--accent-neon-glow)' }}></div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#666', marginBottom: 25 }}>
                <span>Exp: {Math.floor(balance % 50000).toLocaleString()}</span>
                <span>Next: 50,000</span>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.3)', padding: 15, borderRadius: 12, marginBottom: 20 }}>
                <div style={{ fontSize: '0.8rem', color: '#aaa', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 5 }}>История имущества</div>
                <div style={{ textAlign: 'left', maxHeight: 200, overflowY: 'auto' }}>
                  {renderPurchases()}
                </div>
              </div>

              <button className="button" style={{ width: '100%' }}>
                Настройки
              </button>
           </div>
        </div>
      )}

      <BottomNav currentTab={currentTab} setCurrentTab={setCurrentTab} />
    </main>
  );
}
