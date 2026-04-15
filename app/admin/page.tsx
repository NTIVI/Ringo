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

  if (!isAuthenticated) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#333', color: 'white' }}>
        <form onSubmit={handleLogin} style={{ padding: 20, background: '#222', borderRadius: 10, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <h2>Admin Login</h2>
          <input 
            type="password" 
            placeholder="supersecretringo"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ padding: 10, borderRadius: 5, border: 'none' }}
          />
          <button type="submit" style={{ padding: 10, background: '#ff1744', color: 'white', border: 'none', borderRadius: 5, cursor: 'pointer' }}>Login</button>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
      </div>
    );
  }

  return (
    <div style={{ padding: 20, background: '#f5f5f5', color: '#333', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <h1>Ringo Admin Panel</h1>
      
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 20, background: 'white', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <thead>
          <tr style={{ background: '#eee', textAlign: 'left' }}>
            <th style={{ padding: 10, borderBottom: '2px solid #ddd' }}>ID</th>
            <th style={{ padding: 10, borderBottom: '2px solid #ddd' }}>Name (Telegram)</th>
            <th style={{ padding: 10, borderBottom: '2px solid #ddd' }}>Balance</th>
            <th style={{ padding: 10, borderBottom: '2px solid #ddd' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td style={{ padding: 10, borderBottom: '1px solid #ddd' }}>{u.id.substring(0,8)}...</td>
              <td style={{ padding: 10, borderBottom: '1px solid #ddd' }}>{u.name} ({u.telegramId})</td>
              <td style={{ padding: 10, borderBottom: '1px solid #ddd' }}>{Math.floor(u.balance).toLocaleString()}</td>
              <td style={{ padding: 10, borderBottom: '1px solid #ddd' }}>
                 <button 
                  onClick={() => {
                    const newBal = prompt('Enter new balance for ' + u.name, u.balance.toString());
                    if (newBal !== null) handleEditBalance(u.id, newBal);
                  }}
                  style={{ padding: '5px 10px', cursor: 'pointer' }}
                 >
                   Edit Balance
                 </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
