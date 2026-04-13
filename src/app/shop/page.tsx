"use client";

import React, { useState } from "react";
import styles from "./page.module.css";
import { Button } from "@/components/Button";
import { useAppContext } from "@/context/AppProvider";

const SHOP_ITEMS = [
  { id: 1, title: "iPhone 15 Pro", price: 500000, img: "https://images.unsplash.com/photo-1696446701796-da61225697cc?q=80&w=400&h=400&fit=crop" },
  { id: 2, title: "AirPods Pro", price: 150000, img: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?q=80&w=400&h=400&fit=crop" },
  { id: 3, title: "MacBook Air M2", price: 800000, img: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=400&h=400&fit=crop" },
  { id: 4, title: "Apple Watch S9", price: 250000, img: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?q=80&w=400&h=400&fit=crop" },
];

export default function Shop() {
  const { balance, setBalance, user } = useAppContext();
  const [selectedItem, setSelectedItem] = useState<(typeof SHOP_ITEMS)[0] | null>(null);
  const [address, setAddress] = useState("");
  const [buying, setBuying] = useState(false);

  const handlePurchase = async () => {
    if (!user || user.id === undefined || !selectedItem) return;
    if (balance < selectedItem.price) {
      alert("Not enough coins!");
      return;
    }
    if (!address.trim()) {
      alert("Please enter delivery address");
      return;
    }

    setBuying(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tgId: user.id.toString(),
          itemTitle: selectedItem.title,
          itemPrice: selectedItem.price,
          deliveryAddress: address,
        }),
      });
      const data = await res.json();
      if (data.success) {
        alert("Order placed successfully! Check My Orders.");
        setBalance(data.newBalance);
        setSelectedItem(null);
        setAddress("");
      } else {
        alert(data.error);
      }
    } catch (e) {
      alert("Error placing order");
    } finally {
      setBuying(false);
    }
  };

  if (selectedItem) {
    return (
      <div className={styles.container}>
        <button onClick={() => setSelectedItem(null)} className={styles.backButton}>← Back to Shop</button>
        <div className={styles.purchaseCard}>
          <img src={selectedItem.img} alt={selectedItem.title} className={styles.productImgLarge} />
          <h2 className={styles.productTitleLarge}>{selectedItem.title}</h2>
          <div className={styles.productPriceLarge}>{selectedItem.price.toLocaleString()} 💰</div>
          
          <div className={styles.formGroup}>
            <label>Delivery Address:</label>
            <textarea 
              value={address} 
              onChange={e => setAddress(e.target.value)} 
              placeholder="Country, City, Street, Apartment, Zip Code..."
              className={styles.textarea}
              rows={4}
            />
          </div>

          <Button fullWidth onClick={handlePurchase} disabled={buying || balance < selectedItem.price}>
            {buying ? "Processing..." : `Buy for ${selectedItem.price.toLocaleString()} 💰`}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Rewards Shop</h1>
      <p className={styles.subtitle}>Exchange your coins for real prizes!</p>
      
      <div className={styles.grid}>
        {SHOP_ITEMS.map(item => (
          <div key={item.id} className={styles.card}>
            <img src={item.img} alt={item.title} className={styles.productImg} />
            <h3 className={styles.productTitle}>{item.title}</h3>
            <div className={styles.priceRow}>
              <span className={styles.price}>{item.price.toLocaleString()} 💰</span>
              <Button onClick={() => setSelectedItem(item)} disabled={balance < item.price}>
                {balance >= item.price ? "Buy" : "Need Coins"}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
