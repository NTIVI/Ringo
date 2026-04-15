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
    <main style={{ display: 'flex', flexDirection: 'column', height: '100vh', justifyContent: 'center' }}>
      
      <div style={{ margin: '10px 20px', padding: '15px', textAlign: 'center' }}>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '4px', marginBottom: '8px' }}>
          Portfolio Value
        </div>
        <div style={{ fontSize: '3.5rem', fontWeight: '300', color: '#fff', letterSpacing: '2px' }}>
          {Math.floor(balance).toLocaleString()} <span style={{fontSize: '1.5rem', color: 'var(--accent-gold)'}}>RNG</span>
        </div>
      </div>

      {currentTab === 'tap' && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, justifyContent: 'center' }}>
          <DonutClicker 
            balance={balance} 
            setBalance={setBalance}
            stamina={stamina}
            setStamina={setStamina}
            maxStamina={maxStamina}
          />
          <div style={{ marginTop: '40px' }}>
            <button className="button" style={{ background: 'transparent', border: '1px solid var(--accent-gold)', color: 'var(--accent-gold)' }} onClick={() => {
              alert("Accelerate boost verified. x5 multiplier valid for 30s.");
            }}>
              ACCELERATE HYPERDRIVE
            </button>
          </div>
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
              <h2 style={{ fontSize: '1.8rem', marginBottom: '15px', color: 'var(--accent-gold)' }}>Top Players</h2>
              <p style={{ color: '#ccc' }}>Leaderboard is syncing...</p>
           </div>
        </div>
      )}

      <BottomNav currentTab={currentTab} setCurrentTab={setCurrentTab} />
    </main>
  );
}
