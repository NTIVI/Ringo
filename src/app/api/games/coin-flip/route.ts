import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { tgId, betAmount, guess } = await req.json();

    if (!tgId || betAmount <= 0 || !["heads", "tails"].includes(guess)) {
      return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { id: tgId } });
    if (!user || user.coinsBalance < betAmount) {
      return NextResponse.json({ error: "Insufficient balance" }, { status: 400 });
    }

    // Deduct bet immediately to prevent race conditions
    await prisma.user.update({
      where: { id: tgId },
      data: { coinsBalance: { decrement: betAmount } },
    });

    // Flip coin
    const isHeads = Math.random() < 0.5;
    const result = isHeads ? "heads" : "tails";
    const win = guess === result;
    const winAmount = win ? betAmount * 2 : 0;

    // Credit win if applicable and save history
    if (win) {
      await prisma.user.update({
        where: { id: tgId },
        data: { coinsBalance: { increment: winAmount } },
      });
    }

    await prisma.gameHistory.create({
      data: {
        userId: tgId,
        gameName: "Coin Flip",
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
    console.error("Coin Flip Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
