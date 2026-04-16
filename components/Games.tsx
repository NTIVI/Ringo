"use client";

import { useState, useEffect } from 'react';
import styles from './Games.module.css';

type GameType = 'hub' | 'coin' | 'slots' | 'dice';

export default function Games({ balance, setBalance }: { balance: number, setBalance: (b: number) => void }) {
  const [activeGame, setActiveGame] = useState<GameType>('hub');
  const [bet, setBet] = useState(100);
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [winAmount, setWinAmount] = useState<number>(0);

  const resetGame = () => {
    setResult(null);
    setWinAmount(0);
    setIsSpinning(false);
  };

  const handleBack = () => {
    setActiveGame('hub');
    resetGame();
  };

  // --- Coin Flip Logic ---
  const [coinSide, setCoinSide] = useState<'R' | 'G'>('R');
  const playCoinFlip = (side: 'R' | 'G') => {
    if (balance < bet || isSpinning) return;
    setIsSpinning(true);
    setResult(null);
    setBalance(prev => prev - bet);

    setTimeout(() => {
      const win = Math.random() > 0.52; // 52% house edge
      const finalSide = win ? side : (side === 'R' ? 'G' : 'R');
      setCoinSide(finalSide);
      setIsSpinning(false);
      
      if (win) {
        const winVal = bet * 2;
        setWinAmount(winVal);
        setBalance(prev => prev + winVal);
        setResult('ПОБЕДА!');
      } else {
        setResult('ПРОИГРЫШ');
      }
    }, 1000);
  };

  // --- Slots Logic ---
  const [slots, setSlots] = useState(['🍩', '🍩', '🍩']);
  const icons = ['🍩', '💎', '🍒', '7️⃣', '⭐'];
  
  const playSlots = () => {
    if (balance < bet || isSpinning) return;
    setIsSpinning(true);
    setResult(null);
    setBalance(prev => prev - bet);

    const spinInterval = setInterval(() => {
      setSlots([
        icons[Math.floor(Math.random() * icons.length)],
        icons[Math.floor(Math.random() * icons.length)],
        icons[Math.floor(Math.random() * icons.length)]
      ]);
    }, 100);

    setTimeout(() => {
      clearInterval(spinInterval);
      const finalSlots = [
        icons[Math.floor(Math.random() * icons.length)],
        icons[Math.floor(Math.random() * icons.length)],
        icons[Math.floor(Math.random() * icons.length)]
      ];
      setSlots(finalSlots);
      setIsSpinning(false);

      const allEqual = finalSlots[0] === finalSlots[1] && finalSlots[1] === finalSlots[2];
      const twoEqual = finalSlots[0] === finalSlots[1] || finalSlots[1] === finalSlots[2] || finalSlots[0] === finalSlots[2];

      if (allEqual) {
        let mult = 10;
        if (finalSlots[0] === '7️⃣') mult = 50;
        if (finalSlots[0] === '💎') mult = 25;
        const winVal = bet * mult;
        setWinAmount(winVal);
        setBalance(prev => prev + winVal);
        setResult('JACKPOT!');
      } else if (twoEqual) {
        const winVal = Math.floor(bet * 1.5);
        setWinAmount(winVal);
        setBalance(prev => prev + winVal);
        setResult('ВЫИГРЫШ!');
      } else {
        setResult('ПРОИГРЫШ');
      }
    }, 2000);
  };

  // --- Dice Logic ---
  const [dice, setDice] = useState([1, 1]);
  const playDice = (type: 'over' | 'under') => {
    if (balance < bet || isSpinning) return;
    setIsSpinning(true);
    setResult(null);
    setBalance(prev => prev - bet);

    setTimeout(() => {
      const d1 = Math.floor(Math.random() * 6) + 1;
      const d2 = Math.floor(Math.random() * 6) + 1;
      setDice([d1, d2]);
      setIsSpinning(false);
      
      const sum = d1 + d2;
      const win = (type === 'over' && sum > 7) || (type === 'under' && sum < 7);
      
      if (win) {
        const winVal = bet * 2;
        setWinAmount(winVal);
        setBalance(prev => prev + winVal);
        setResult('ВЫИГРЫШ!');
      } else {
        setResult('ПРОИГРЫШ');
      }
    }, 800);
  };

  const renderHub = () => (
    <div className={styles.gameSelection}>
      <h2 className="title" style={{ marginBottom: 30 }}>Казино Ringo</h2>
      
      <div className={styles.gameCard} onClick={() => setActiveGame('coin')}>
        <div className={styles.gameIcon}>🪙</div>
        <div className={styles.gameInfo}>
          <h3>Орел или Решка</h3>
          <p>Удвой за один бросок</p>
        </div>
      </div>

      <div className={styles.gameCard} onClick={() => setActiveGame('slots')}>
        <div className={styles.gameIcon}>🎰</div>
        <div className={styles.gameInfo}>
          <h3>Слоты Удачи</h3>
          <p>Сорви куш до x50</p>
        </div>
      </div>

      <div className={styles.gameCard} onClick={() => setActiveGame('dice')}>
        <div className={styles.gameIcon}>🎲</div>
        <div className={styles.gameInfo}>
          <h3>Кости</h3>
          <p>Больше или меньше 7</p>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: 20, marginTop: 20, textAlign: 'center' }}>
        <p style={{ color: 'var(--accent-gold)', fontWeight: 800 }}>🎁 ПРИЗЫ НЕДЕЛИ</p>
        <p style={{ fontSize: '0.8rem', marginTop: 5 }}>Играй и копи на iPhone 15 Pro!</p>
      </div>
    </div>
  );

  return (
    <div className={styles.gamesContainer}>
      {activeGame !== 'hub' && (
        <button className={styles.backBtn} onClick={handleBack}>← Назад в лобби</button>
      )}

      {activeGame === 'hub' && renderHub()}

      {activeGame === 'coin' && (
        <div className={styles.gameWrapper}>
          <h2 className="title">Coin Flip</h2>
          <div className={styles.coinContainer}>
            <div className={`${styles.coin} ${isSpinning ? styles.coinSpinning : ''}`}>
              {coinSide === 'R' ? 'R' : 'G'}
            </div>
            
            <div className={styles.betControls}>
              <input 
                type="number" 
                className={styles.betInput} 
                value={bet} 
                onChange={(e) => setBet(Math.max(1, parseInt(e.target.value) || 0))}
              />
              <div style={{ display: 'flex', gap: 10 }}>
                <button className="button" style={{ flex: 1 }} onClick={() => playCoinFlip('R')} disabled={isSpinning}>Орел (R)</button>
                <button className="button" style={{ flex: 1, background: 'var(--btn-gradient)' }} onClick={() => playCoinFlip('G')} disabled={isSpinning}>Решка (G)</button>
              </div>
            </div>

            {result && <div className={styles.winText}>{result} {winAmount > 0 && `+${winAmount}`}</div>}
          </div>
        </div>
      )}

      {activeGame === 'slots' && (
        <div className={styles.gameWrapper}>
          <h2 className="title">Super Slots</h2>
          <div className={styles.slotMachine}>
            <div className={styles.reels}>
              {slots.map((s, i) => (
                <div key={i} className={styles.reel}>{s}</div>
              ))}
            </div>
            
            <div className={styles.betControls}>
              <input 
                type="number" 
                className={styles.betInput} 
                value={bet} 
                onChange={(e) => setBet(Math.max(1, parseInt(e.target.value) || 0))}
              />
              <button className="button" style={{ width: '100%', fontSize: '1.5rem', padding: 20 }} onClick={playSlots} disabled={isSpinning}>
                {isSpinning ? 'КРУТИМ...' : 'SPIN'}
              </button>
            </div>

            {result && <div className={styles.winText}>{result} {winAmount > 0 && `+${winAmount}`}</div>}
          </div>
        </div>
      )}

      {activeGame === 'dice' && (
        <div className={styles.gameWrapper}>
          <h2 className="title">Dice Roll</h2>
          <div className={styles.coinContainer}>
            <div style={{ display: 'flex', gap: 20 }}>
              <div className={styles.reel} style={{ fontSize: '4rem', width: 100, height: 100 }}>{dice[0]}</div>
              <div className={styles.reel} style={{ fontSize: '4rem', width: 100, height: 100 }}>{dice[1]}</div>
            </div>
            
            <div className={styles.betControls}>
              <input 
                type="number" 
                className={styles.betInput} 
                value={bet} 
                onChange={(e) => setBet(Math.max(1, parseInt(e.target.value) || 0))}
              />
              <div style={{ display: 'flex', gap: 10 }}>
                <button className="button" style={{ flex: 1 }} onClick={() => playDice('under')} disabled={isSpinning}>Меньше 7</button>
                <button className="button" style={{ flex: 1 }} onClick={() => playDice('over')} disabled={isSpinning}>Больше 7</button>
              </div>
            </div>

            {result && <div className={styles.winText}>{result} {winAmount > 0 && `+${winAmount}`}</div>}
          </div>
        </div>
      )}
    </div>
  );
}
