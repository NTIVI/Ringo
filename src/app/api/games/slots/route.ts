import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const SYMBOLS = ["🍒", "🍋", "🍉", "⭐", "💎"];
const MULTIPLIERS: Record<string, number> = {
  "🍒": 2,
  "🍋": 5,
  "🍉": 10,
  "⭐": 20,
  "💎": 100,
};

export async function POST(req: Request) {
  try {
    const { tgId, betAmount } = await req.json();

    if (!tgId || betAmount <= 0) {
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

    const result = [
      SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
      SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
      SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
    ];

    let win = false;
    let winAmount = 0;

    if (result[0] === result[1] && result[1] === result[2]) {
      win = true;
      winAmount = betAmount * MULTIPLIERS[result[0]];
    }

    if (win) {
      await prisma.user.update({
        where: { id: tgId },
        data: { coinsBalance: { increment: winAmount } },
      });
    }

    await prisma.gameHistory.create({
      data: {
        userId: tgId,
        gameName: "Slots",
        betAmount,
        winAmount,
      },
    });

    const newBalance = user.coinsBalance - betAmount + winAmount;

    return NextResponse.json({
      success: true,
      result,
      win,
      winAmount,
      newBalance,
    });
  } catch (error) {
    console.error("Slots Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
