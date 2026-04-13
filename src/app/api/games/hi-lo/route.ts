import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { tgId, betAmount, guess, baseCard } = await req.json();

    if (!tgId || betAmount <= 0 || !["higher", "lower"].includes(guess) || baseCard < 1 || baseCard > 13) {
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

    let nextCard = Math.floor(Math.random() * 13) + 1;
    // Don't allow a tie for simplicity
    while (nextCard === baseCard) {
      nextCard = Math.floor(Math.random() * 13) + 1;
    }

    const win = guess === "higher" ? nextCard > baseCard : nextCard < baseCard;
    
    // Dynamic multiplier based on probability
    let prob = guess === "higher" ? (13 - baseCard) / 12 : (baseCard - 1) / 12;
    // ensure no infinite payout
    prob = Math.max(0.05, prob);
    
    const multiplier = 0.95 / prob; // 5% house edge
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
        gameName: "Hi-Lo",
        betAmount,
        winAmount,
      },
    });

    const newBalance = user.coinsBalance - betAmount + winAmount;

    return NextResponse.json({
      success: true,
      nextCard,
      win,
      winAmount,
      newBalance,
    });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
