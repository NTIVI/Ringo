"use client";

import { useState, useEffect } from 'react';
import DonutClicker from '@/components/DonutClicker';
import Shop from '@/components/Shop';
import BottomNav from '@/components/BottomNav';
export default function Home() {
  const [balance, setBalance] = useState(0);
  const [stamina, setStamina] = useState(100);
  const maxStamina = 100;
  const [currentTab, setCurrentTab] = useState<'tap' | 'shop' | 'leaderboard'>('tap');

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
      <h1 className="title" style={{ marginTop: '20px' }}>Ringo</h1>
      
      <div className="glass-panel" style={{ margin: '10px 20px', padding: '15px', textAlign: 'center' }}>
        <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--accent-gold)' }}>
          {Math.floor(balance).toLocaleString()}
        </div>
        <div style={{ fontSize: '0.9rem', color: '#ccc', textTransform: 'uppercase', letterSpacing: '2px' }}>
          Total Balance
        </div>
      </div>

      {currentTab === 'tap' && (
        <>
          <DonutClicker 
            balance={balance} 
            setBalance={setBalance}
            stamina={stamina}
            setStamina={setStamina}
            maxStamina={maxStamina}
          />
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
            <button className="button" style={{ background: 'var(--accent-gold)', color: '#000', border: 'none' }} onClick={() => {
              alert("Watched Ad! x5 boost activated for 30 seconds!");
            }}>
              ▶️ Watch Ad for x5 Boost
            </button>
          </div>
        </>
      )}

      {currentTab === 'shop' && (
        <div style={{ flex: 1, overflowY: 'auto', padding: '10px' }}>
          <Shop onClose={() => setCurrentTab('tap')} balance={balance} />
        </div>
      )}
      
      {currentTab === 'leaderboard' && (
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
           <div className="glass-panel" style={{ padding: 20 }}>
              <h2 style={{ fontSize: '1.8rem', marginBottom: '15px', color: 'var(--accent-gold)' }}>Top Players</h2>
              <p style={{ color: '#ccc' }}>Leaderboard is syncing...</p>
           </div>
        </div>
      )}

      <BottomNav currentTab={currentTab} setCurrentTab={setCurrentTab} />
    </main>
  );
}
