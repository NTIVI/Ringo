"use client";

import React, { useState } from "react";
import styles from "./page.module.css";
import { Button } from "@/components/Button";

interface AdminOrder {
  id: number;
  userId: string;
  itemTitle: string;
  itemPrice: number;
  deliveryAddress: string;
  status: string;
  createdAt: string;
  user: {
    firstName: string;
    username: string | null;
  };
}

export default function Admin() {
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [orders, setOrders] = useState<AdminOrder[]>([]);

  const fetchOrders = async (pwd: string) => {
    try {
      const res = await fetch(`/api/admin/orders?password=${pwd}`);
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders);
        setLoggedIn(true);
      } else {
        alert(data.error);
      }
    } catch {
      alert("Error logging in");
    }
  };

  const updateStatus = async (orderId: number, status: string) => {
    try {
      const res = await fetch("/api/admin/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, orderId, status }),
      });
      const data = await res.json();
      if (data.success) {
        setOrders(orders.map(o => o.id === orderId ? { ...o, status: data.order.status } : o));
      }
    } catch {
      alert("Error updating status");
    }
  };

  if (!loggedIn) {
    return (
      <div className={styles.container}>
        <div className={styles.loginCard}>
          <h2>Admin Login</h2>
          <input 
            type="password" 
            placeholder="Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
          />
          <Button onClick={() => fetchOrders(password)}>Login</Button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Admin Panel</h1>
      <p>Manage orders placed by users.</p>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Item</th>
              <th>Address</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>
                  {order.user?.firstName}
                  <br />
                  <small>@{order.user?.username || order.userId}</small>
                </td>
                <td>{order.itemTitle} ({order.itemPrice} 💰)</td>
                <td>{order.deliveryAddress}</td>
                <td>
                  <span className={`${styles.statusBadge} ${styles[order.status.toLowerCase()]}`}>
                    {order.status}
                  </span>
                </td>
                <td>
                  <select 
                    value={order.status} 
                    onChange={e => updateStatus(order.id, e.target.value)}
                    className={styles.select}
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="SHIPPED">SHIPPED</option>
                    <option value="DELIVERED">DELIVERED</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
