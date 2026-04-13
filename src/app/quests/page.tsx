"use client";

import React, { useEffect, useState } from "react";
import styles from "./page.module.css";
import { Button } from "@/components/Button";
import { useAppContext } from "@/context/AppProvider";

interface Quest {
  id: number;
  questType: string;
  progress: number;
  completed: boolean;
  description: string;
  target: number;
  reward: number;
}

export default function Quests() {
  const { user, balance, setBalance } = useAppContext();
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState<number | null>(null);

  useEffect(() => {
    if (user?.id) {
      fetchQuests();
    }
  }, [user]);

  const fetchQuests = async () => {
    try {
      const res = await fetch(`/api/quests?tgId=${user.id}`);
      const data = await res.json();
      if (data.success) {
        setQuests(data.quests);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleClaim = async (questId: number) => {
    setClaiming(questId);
    try {
      const res = await fetch("/api/quests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tgId: user.id.toString(), questId }),
      });
      const data = await res.json();
      if (data.success) {
        alert(`Claimed ${data.reward} 💰!`);
        setBalance(balance + data.reward);
        fetchQuests();
      } else {
        alert(data.error);
      }
    } catch (e) {
      alert("Error claiming quest");
    } finally {
      setClaiming(null);
    }
  };

  if (loading) {
    return <div className={styles.container}><p>Loading quests...</p></div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Daily Quests</h1>
      <p className={styles.subtitle}>Complete tasks to earn more coins!</p>

      <div className={styles.questList}>
        {quests.map(quest => {
          // For demo, we let users "Simulate" completing it if it's not done
          const isDone = quest.completed;
          const progressPercent = Math.min((quest.progress / quest.target) * 100, 100);

          return (
            <div key={quest.id} className={`${styles.questCard} ${isDone ? styles.completed : ""}`}>
              <div className={styles.questInfo}>
                <h3 className={styles.questDesc}>{quest.description}</h3>
                <span className={styles.reward}>Reward: +{quest.reward} 💰</span>
              </div>
              
              <div className={styles.actionArea}>
                {!isDone ? (
                  <Button 
                    variant="primary" 
                    onClick={() => handleClaim(quest.id)}
                    disabled={claiming === quest.id}
                  >
                    {claiming === quest.id ? "..." : "Claim"}
                  </Button>
                ) : (
                  <Button variant="secondary" disabled>Done</Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
