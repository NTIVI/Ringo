"use client";

import React, { useEffect, useState } from "react";
import styles from "./page.module.css";
import { useAppContext } from "@/context/AppProvider";
import Link from "next/link";

interface Order {
  id: number;
  itemTitle: string;
  itemPrice: number;
  status: string;
  createdAt: string;
}

export default function MyOrders() {
  const { user } = useAppContext();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetch(`/api/orders?tgId=${user.id}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setOrders(data.orders);
          }
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [user]);

  if (loading) {
    return <div className={styles.container}><p>Loading orders...</p></div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link href="/shop" className={styles.backButton}>← Shop</Link>
        <h1 className={styles.title}>My Orders</h1>
      </div>

      {orders.length === 0 ? (
        <div className={styles.emptyState}>
          <p>You haven't ordered anything yet.</p>
          <Link href="/shop" className={styles.shopLink}>Go to Shop</Link>
        </div>
      ) : (
        <div className={styles.orderList}>
          {orders.map(order => (
            <div key={order.id} className={styles.orderCard}>
              <div className={styles.orderInfo}>
                <h3 className={styles.orderTitle}>{order.itemTitle}</h3>
                <span className={styles.orderPrice}>{order.itemPrice.toLocaleString()} 💰</span>
                <span className={styles.orderDate}>
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className={`${styles.orderStatus} ${styles[order.status.toLowerCase()]}`}>
                {order.status}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
