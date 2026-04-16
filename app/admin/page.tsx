"use client";

import { useState, useEffect } from "react";

export default function AdminPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState("");

  const fetchUsers = async (pwd: string) => {
    try {
      const res = await fetch('/api/admin/users', {
        headers: { 'x-admin-key': pwd }
      });
      if (res.ok) {
        setUsers(await res.json());
        setIsAuthenticated(true);
        setError("");
      } else {
        setError("Invalid admin password");
      }
    } catch (e) {
      setError("Network error");
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUsers(password);
  };

  const handleEditBalance = async (userId: string, newBalance: string) => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': password
        },
        body: JSON.stringify({ userId, balance: parseFloat(newBalance) })
      });
      if (res.ok) {
        fetchUsers(password); // refresh
      }
    } catch (e) {
      alert("Failed to update balance");
    }
  };

  const handleAdjustBalance = async (userId: string, amount: number) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    const newBalance = user.balance + amount;
    handleEditBalance(userId, newBalance.toString());
  };

  if (!isAuthenticated) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#0F0005', color: 'white' }}>
        <form onSubmit={handleLogin} style={{ padding: 30, background: '#1A0208', borderRadius: 16, border: '1px solid rgba(255, 23, 68, 0.3)', display: 'flex', flexDirection: 'column', gap: 15, width: '300px' }}>
          <h2 style={{ textAlign: 'center', fontWeight: 900 }}>Admin Access</h2>
          <input 
            type="password" 
            placeholder="Admin Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ padding: 12, borderRadius: 8, border: '1px solid #333', background: '#000', color: '#fff' }}
          />
          <button type="submit" style={{ padding: 12, background: 'var(--btn-gradient)', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 700 }}>Authenticate</button>
          {error && <p style={{ color: '#ff1744', textAlign: 'center', fontSize: '0.8rem' }}>{error}</p>}
        </form>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', background: '#0F0005', color: '#fff', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      <h1 style={{ fontWeight: 900, fontSize: '2rem', marginBottom: 20 }}>Ringo Command Center</h1>
      
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', background: '#1A0208', borderRadius: 12, overflow: 'hidden' }}>
          <thead>
            <tr style={{ background: '#2A0413', textAlign: 'left' }}>
              <th style={{ padding: 15, color: '#aaa' }}>User</th>
              <th style={{ padding: 15, color: '#aaa' }}>Status</th>
              <th style={{ padding: 15, color: '#aaa' }}>Balance</th>
              <th style={{ padding: 15, color: '#aaa' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} style={{ borderBottom: '1px solid #2A0413' }}>
                <td style={{ padding: 15 }}>
                  <div style={{ fontWeight: 700 }}>{u.name}</div>
                  <div style={{ fontSize: '0.8rem', color: '#666' }}>@{u.username || 'no_user'}</div>
                </td>
                <td style={{ padding: 15 }}>Lvl {u.level || 1}</td>
                <td style={{ padding: 15, fontWeight: 900, color: '#FFD700' }}>{Math.floor(u.balance).toLocaleString()}</td>
                <td style={{ padding: 15 }}>
                  <div style={{ display: 'flex', gap: 5 }}>
                    <button onClick={() => handleAdjustBalance(u.id, 10000)} style={{ background: '#00e676', border: 'none', padding: '5px 10px', borderRadius: 4, color: '#000', fontWeight: 700, cursor: 'pointer' }}>+10k</button>
                    <button onClick={() => handleAdjustBalance(u.id, 100000)} style={{ background: '#00e676', border: 'none', padding: '5px 10px', borderRadius: 4, color: '#000', fontWeight: 700, cursor: 'pointer' }}>+100k</button>
                    <button onClick={() => handleAdjustBalance(u.id, -50000)} style={{ background: '#ff1744', border: 'none', padding: '5px 10px', borderRadius: 4, color: '#fff', fontWeight: 700, cursor: 'pointer' }}>-50k</button>
                    <button 
                      onClick={() => {
                        const newBal = prompt('Exact balance for ' + u.name, u.balance.toString());
                        if (newBal !== null) handleEditBalance(u.id, newBal);
                      }}
                      style={{ background: '#333', border: 'none', padding: '5px 10px', borderRadius: 4, color: '#fff', cursor: 'pointer' }}
                    >
                      ✏️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
