import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { tgId, betAmount, betType } = await req.json();

    if (!tgId || betAmount <= 0 || !["red", "black", "green"].includes(betType)) {
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

    const roll = Math.floor(Math.random() * 37); // 0-36
    let resultColor = "red";
    if (roll === 0) resultColor = "green";
    else if (roll % 2 === 0) resultColor = "black";

    const win = betType === resultColor;
    let multiplier = betType === "green" ? 14 : 2; // Green pays 14x, others 2x
    
    const winAmount = win ? betAmount * multiplier : 0;

    if (win) {
      await prisma.user.update({
        where: { id: tgId },
        data: { coinsBalance: { increment: winAmount } },
      });
    }

    await prisma.gameHistory.create({
      data: { userId: tgId, gameName: "Roulette", betAmount, winAmount },
    });

    return NextResponse.json({
      success: true, roll, resultColor, win, winAmount, newBalance: user.coinsBalance - betAmount + winAmount,
    });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
