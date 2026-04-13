import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { tgId, betAmount, targetMultiplier } = await req.json();

    if (!tgId || betAmount <= 0 || targetMultiplier <= 1.0) {
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

    // Crash logic: e = 100, house edge 1%
    // formula: (100 * e - h) / (e - h) -> simple approach: 
    // random between 0 and 1. Crash point = 0.99 / (1 - Math.random())
    const r = Math.random();
    const crashPoint = Math.max(1.0, 0.99 / (1 - r));
    
    // Formatting to 2 decimal places
    const finalCrash = parseFloat(crashPoint.toFixed(2));
    
    const win = finalCrash >= targetMultiplier;
    const winAmount = win ? Math.floor(betAmount * targetMultiplier) : 0;

    if (win) {
      await prisma.user.update({
        where: { id: tgId },
        data: { coinsBalance: { increment: winAmount } },
      });
    }

    await prisma.gameHistory.create({
      data: {
        userId: tgId,
        gameName: "Crash",
        betAmount,
        winAmount,
      },
    });

    const newBalance = user.coinsBalance - betAmount + winAmount;

    return NextResponse.json({
      success: true,
      crashPoint: finalCrash,
      win,
      winAmount,
      newBalance,
    });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
