import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { tgId, betAmount, target, condition } = await req.json();

    if (!tgId || betAmount <= 0 || target < 2 || target > 98 || !["over", "under"].includes(condition)) {
      return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { id: tgId } });
    if (!user || user.coinsBalance < betAmount) {
      return NextResponse.json({ error: "Insufficient balance" }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: tgId },
      data: { coinsBalance: { decrement: betAmount } },
    });

    const roll = Math.floor(Math.random() * 100) + 1; // 1 to 100
    
    let win = false;
    let multiplier = 0;

    if (condition === "over") {
      win = roll > target;
      multiplier = 99 / (100 - target);
    } else {
      win = roll < target;
      multiplier = 99 / target;
    }

    // Applying a minimal house edge roughly represented by 99 instead of 100 in the formula
    const winAmount = win ? Math.floor(betAmount * multiplier) : 0;

    if (win) {
      await prisma.user.update({
        where: { id: tgId },
        data: { coinsBalance: { increment: winAmount } },
      });
    }

    await prisma.gameHistory.create({
      data: {
        userId: tgId,
        gameName: "Dice",
        betAmount,
        winAmount,
      },
    });

    const newBalance = user.coinsBalance - betAmount + winAmount;

    return NextResponse.json({
      success: true,
      roll,
      win,
      winAmount,
      newBalance,
    });
  } catch (error) {
    console.error("Dice Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
