"use client";

import { useState, useEffect } from 'react';
import DonutClicker from '@/components/DonutClicker';
import Shop from '@/components/Shop';

export default function Home() {
  const [balance, setBalance] = useState(0);
  const [stamina, setStamina] = useState(100);
  const maxStamina = 100;
  const [showShop, setShowShop] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

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
    <main style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <h1 className="title">Ringo</h1>
      
      <div style={{ textAlign: 'center', fontSize: '2rem', fontWeight: 'bold', color: 'var(--accent-gold)', margin: '10px 0' }}>
        {Math.floor(balance).toLocaleString()}
      </div>

      <DonutClicker 
        balance={balance} 
        setBalance={setBalance}
        stamina={stamina}
        setStamina={setStamina}
        maxStamina={maxStamina}
      />

      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', padding: '20px' }}>
        <button className="button" style={{ background: '#ffd700', color: '#333' }} onClick={() => {
          alert("Watched Ad! x5 boost activated for 30 seconds!");
        }}>
          ▶️ Watch Ad for x5 Boost
        </button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', padding: '10px 20px' }}>
        <button className="button" onClick={() => setShowShop(true)}>
          🏪 Shop
        </button>
        <button className="button" onClick={() => setShowLeaderboard(true)}>
          🏆 Top
        </button>
      </div>

      {showShop && <Shop onClose={() => setShowShop(false)} balance={balance} />}
      
      {showLeaderboard && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'var(--bg-gradient)', zIndex: 200, padding: 20, overflowY: 'auto' }}>
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
             <h2 style={{ fontSize: '2rem'}}>Leaderboard</h2>
             <button className="button" onClick={() => setShowLeaderboard(false)}>Back</button>
           </div>
           <div className="glass-panel" style={{ padding: 20 }}>
              <p>Top players are coming soon...</p>
           </div>
        </div>
      )}
    </main>
  );
}
