import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const WHEEL_PRIZES = [
  { label: "10", multiplier: 0.1 },
  { label: "50", multiplier: 0.5 },
  { label: "100", multiplier: 1 },
  { label: "200", multiplier: 2 },
  { label: "500", multiplier: 5 },
  { label: "1000", multiplier: 10 },
];

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

    const index = Math.floor(Math.random() * WHEEL_PRIZES.length);
    const prize = WHEEL_PRIZES[index];
    const winAmount = Math.floor(betAmount * prize.multiplier);

    if (winAmount > 0) {
      await prisma.user.update({
        where: { id: tgId },
        data: { coinsBalance: { increment: winAmount } },
      });
    }

    await prisma.gameHistory.create({
      data: {
        userId: tgId,
        gameName: "Wheel of Fortune",
        betAmount,
        winAmount,
      },
    });

    const newBalance = user.coinsBalance - betAmount + winAmount;

    return NextResponse.json({
      success: true,
      index,
      prizeLabel: prize.label,
      winAmount,
      newBalance,
    });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
