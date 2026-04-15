import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { telegramId, balanceTotal, staminaTotal, donutsClicked } = body;

    if (!telegramId || balanceTotal === undefined || staminaTotal === undefined) {
      return NextResponse.json({ error: 'Missing sync data' }, { status: 400 });
    }

    // Update sync data including Level calculation
    const userLookup = await prisma.user.findUnique({ where: { telegramId: String(telegramId) } });
    if (!userLookup) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const newLevel = Math.floor(balanceTotal / 50000) + 1;

    const user = await prisma.user.update({
      where: { telegramId: String(telegramId) },
      data: {
        balance: balanceTotal,
        stamina: staminaTotal,
        level: newLevel > userLookup.level ? newLevel : userLookup.level,
        lastStaminaSync: new Date(),
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error syncing:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
