"use client";

import { useState, useEffect } from 'react';
import DonutClicker from '@/components/DonutClicker';
import Shop from '@/components/Shop';
import BottomNav from '@/components/BottomNav';
import Boosts from '@/components/Boosts';

export default function Home() {
  const [balance, setBalance] = useState(0);
  const [stamina, setStamina] = useState(100);
  const [multiplier, setMultiplier] = useState(1);
  const maxStamina = 100;
  const [userData, setUserData] = useState<any>(null);
  const [currentTab, setCurrentTab] = useState<'tap' | 'boosts' | 'shop' | 'leaderboard' | 'profile'>('tap');

  // Map donut ID to multiplier
  const getMultiplier = (id: number) => {
    switch (id) {
      case 2: return 2;  // Glazed
      case 3: return 5;  // Space
      case 4: return 10; // Golden
      default: return 1; // Classic
    }
  };

  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(false);

  useEffect(() => {
    let retryCount = 0;
    const maxRetries = 10;

    const initTelegam = () => {
      const tg = (window as any).Telegram?.WebApp;
      if (tg) {
        tg.ready();
        tg.expand();
        loadUser(tg);
      } else if (retryCount < maxRetries) {
        retryCount++;
        setTimeout(initTelegam, 200);
      } else {
        // Safe fallback if TG fails after retries
        loadUser(null);
      }
    };

    const loadUser = async (tg: any) => {
      try {
        const tgUser = tg?.initDataUnsafe?.user;
        
        const telegramId = tgUser?.id?.toString() || 'test_user_1';
        const firstName = tgUser?.first_name || 'Player';
        const lastName = tgUser?.last_name || '';
        const name = `${firstName} ${lastName}`.trim();
        const username = tgUser?.username || 'user';
        const avatarUrl = tgUser?.photo_url || '';

        console.log("Loading user:", telegramId);

        const res = await fetch('/api/user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ telegramId, name, username, avatarUrl })
        });
        
        const data = await res.json();
        if (reqOk(res, data)) {
          console.log("User data loaded:", data);
          setUserData(data);
          setBalance(data.balance);
          setMultiplier(getMultiplier(data.currentDonutId || 1));
          setStamina(Math.min(data.stamina, maxStamina));
        } else {
          console.error("User fetch failed:", data);
          // Set minimal user data so app isn't stuck
          setUserData({ 
            telegramId, 
            name, 
            username: username || 'user', 
            avatarUrl: avatarUrl || '',
            balance: 0, 
            stamina: 100, 
            level: 1,
            purchases: [] 
          });
        }
      } catch (err) {
        console.error("Failed to load user:", err);
        // Fallback for network error
        const tgUser = tg?.initDataUnsafe?.user;
        setUserData({ 
          telegramId: tgUser?.id?.toString() || 'test_user_1', 
          name: tgUser?.first_name || 'Player', 
          username: tgUser?.username || 'user',
          avatarUrl: tgUser?.photo_url || '',
          balance: 0, 
          stamina: 100, 
          level: 1,
          purchases: []
        });
      }
    };

    initTelegam();
  }, []);

  // Fetch Leaderboard when needed
  useEffect(() => {
    if (currentTab === 'leaderboard' && leaderboard.length === 0) {
      const fetchLeaderboard = async () => {
        setLoadingLeaderboard(true);
        try {
          const res = await fetch('/api/leaderboard');
          const data = await res.json();
          if (res.ok) setLeaderboard(data);
        } catch (err) {
          console.error("Leaderboard fetch error", err);
        } finally {
          setLoadingLeaderboard(false);
        }
      };
      fetchLeaderboard();
    }
  }, [currentTab, leaderboard.length]);

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
    <main style={{ display: 'flex', flexDirection: 'column', height: '100vh', justifyContent: 'flex-start', paddingTop: 10 }}>
      
      {currentTab === 'tap' && (
        <div style={{ margin: '20px auto', textAlign: 'center', width: '90%', maxWidth: '400px' }}>
          <div className="glass-panel" style={{ 
            padding: '20px', 
            background: 'linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0.2) 100%)',
            border: '1px solid rgba(255, 23, 68, 0.2)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            boxShadow: '0 15px 35px rgba(0,0,0,0.4)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 5 }}>
              <div style={{ 
                width: 45, height: 45, 
                background: 'linear-gradient(135deg, #FFD700 0%, #FFA000 100%)', 
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                boxShadow: '0 0 15px rgba(255, 215, 0, 0.4)',
                fontWeight: 900,
                color: '#fff',
                textShadow: '0 2px 4px rgba(0,0,0,0.3)'
              }}>R</div>
              <div className="gradient-text" style={{ fontSize: '3.2rem', fontWeight: '900', letterSpacing: '-1px' }}>
                {Math.floor(balance).toLocaleString()} 
              </div>
            </div>
            <div style={{ 
              fontSize: '0.85rem', 
              color: 'var(--text-secondary)', 
              fontWeight: '700', 
              letterSpacing: '4px',
              textTransform: 'uppercase',
              opacity: 0.8,
              borderTop: '1px solid rgba(255,255,255,0.05)',
              paddingTop: 8,
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              gap: 8,
              alignItems: 'center'
            }}>
              <span style={{ color: 'var(--accent-neon)' }}>✧</span> 
              RNG Token Balance 
              <span style={{ color: 'var(--accent-neon)' }}>✧</span>
            </div>
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
            multiplier={multiplier}
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
          <Shop 
            onClose={() => setCurrentTab('tap')} 
            balance={balance} 
            setBalance={setBalance} 
            setMultiplier={(m) => {
              setMultiplier(m);
              if (userData) setUserData({...userData, currentDonutId: -1}); // Trigger a refresh or local update
            }}
            currentDonutId={userData?.currentDonutId || 1}
          />
        </div>
      )}
      
      {currentTab === 'leaderboard' && (
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
           <div className="glass-panel" style={{ padding: 20, minHeight: '80%' }}>
              <h2 className="title" style={{ marginBottom: 20 }}>Топ Игроков</h2>
              
              {loadingLeaderboard ? (
                <p style={{ color: 'var(--text-secondary)', textAlign: 'center' }}>Загрузка...</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {leaderboard.map((user, index) => {
                    const isMe = user.telegramId === userData?.telegramId;
                    return (
                      <div key={user.id} style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between', 
                        padding: '12px 15px', 
                        background: isMe ? 'rgba(255, 255, 255, 0.15)' : (index < 3 ? 'rgba(255, 64, 129, 0.1)' : 'rgba(255,255,255,0.02)'), 
                        borderRadius: 12, 
                        border: isMe ? '2px solid var(--accent-neon)' : (index < 3 ? '1px solid rgba(255, 64, 129, 0.2)' : '1px solid transparent'),
                        boxShadow: isMe ? '0 0 15px var(--accent-neon-glow)' : 'none'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <span style={{ fontSize: '1.2rem', fontWeight: 900, color: index === 0 ? '#ffd700' : index === 1 ? '#c0c0c0' : index === 2 ? '#cd7f32' : '#666', width: 25 }}>
                            {index + 1}
                          </span>
                          <div style={{ fontWeight: isMe ? 900 : 700 }}>{user.name} {isMe && '(Вы)'}</div>
                        </div>
                        <div style={{ fontWeight: 800, color: isMe ? '#fff' : 'var(--accent-neon)' }}>
                          {Math.floor(user.balance).toLocaleString()} <span style={{ fontSize: '0.7rem', color: '#ffcdd2' }}>RNG</span>
                        </div>
                      </div>
                    );
                  })}
                  
                  {/* Show current user if not in top list (placeholder since we don't have total rank yet) */}
                  {!leaderboard.some(u => u.telegramId === userData?.telegramId) && userData && (
                    <>
                      <div style={{ textAlign: 'center', color: '#444', margin: '5px 0' }}>•••</div>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between', 
                        padding: '12px 15px', 
                        background: 'rgba(255, 255, 255, 0.15)', 
                        borderRadius: 12, 
                        border: '2px solid var(--accent-neon)',
                        boxShadow: '0 0 15px var(--accent-neon-glow)'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <span style={{ fontSize: '1.2rem', fontWeight: 900, color: '#666', width: 25 }}>?</span>
                          <div style={{ fontWeight: 900 }}>{userData.name} (Вы)</div>
                        </div>
                        <div style={{ fontWeight: 800, color: '#fff' }}>
                          {Math.floor(balance).toLocaleString()} <span style={{ fontSize: '0.7rem', color: '#ffcdd2' }}>RNG</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
           </div>
        </div>
      )}

      {currentTab === 'profile' && (
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
           {!userData ? (
             <div className="glass-panel" style={{ padding: 40, textAlign: 'center' }}>
                <p style={{ color: 'var(--text-secondary)' }}>Загрузка профиля...</p>
             </div>
           ) : (
             <div className="glass-panel" style={{ padding: '30px 20px', textAlign: 'center', position: 'relative' }}>
                <div style={{ position: 'absolute', top: 15, right: 15, background: 'var(--accent-neon)', color: '#fff', fontSize: '0.8rem', padding: '4px 12px', borderRadius: '12px', fontWeight: 900, boxShadow: '0 0 10px var(--accent-neon-glow)' }}>
                  Lvl {userData.level || 1}
                </div>

                <div style={{ width: 100, height: 100, borderRadius: '50px', background: 'var(--btn-gradient)', margin: '0 auto 15px', position: 'relative', overflow: 'hidden', border: '3px solid var(--accent-neon)', boxShadow: '0 0 20px var(--accent-neon-glow)' }}>
                  {userData.avatarUrl ? (
                    <img src={userData.avatarUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ fontSize: '3rem', lineHeight: '100px' }}>👤</div>
                  )}
                </div>
                
                <h2 style={{ fontSize: '1.6rem', fontWeight: '900', color: '#fff', marginBottom: 2 }}>{userData.name}</h2>
                <p style={{ color: 'var(--accent-neon)', fontSize: '0.9rem', marginBottom: 5, fontWeight: 600 }}>@{userData.username || 'user'}</p>
                <p style={{ color: '#666', fontSize: '0.75rem', marginBottom: 15 }}>ID: {userData.telegramId}</p>
  
                {/* Level Progress Bar */}
                <div style={{ width: '100%', height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 3, marginBottom: 5, overflow: 'hidden' }}>
                  <div style={{ width: `${(balance % 50000) / 500}%`, height: '100%', background: 'var(--accent-neon)', boxShadow: '0 0 10px var(--accent-neon-glow)' }}></div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#666', marginBottom: 25 }}>
                  <span>Exp: {Math.floor(balance % 50000).toLocaleString()}</span>
                  <span>Next: 50,000</span>
                </div>
  
                <div style={{ background: 'rgba(0,0,0,0.3)', padding: 15, borderRadius: 12 }}>
                  <div style={{ fontSize: '0.8rem', color: '#aaa', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 5 }}>История имущества</div>
                  <div style={{ textAlign: 'left', maxHeight: 200, overflowY: 'auto' }}>
                    {renderPurchases()}
                  </div>
                </div>
             </div>
           )}
        </div>
      )}

      <BottomNav currentTab={currentTab} setCurrentTab={setCurrentTab} />
    </main>
  );
}
