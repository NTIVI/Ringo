import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { telegramId, balanceTotal, staminaTotal, donutsClicked } = body;

    if (!telegramId || balanceTotal === undefined || staminaTotal === undefined) {
      return NextResponse.json({ error: 'Missing sync data' }, { status: 400 });
    }

    // Since it's a simple clicker, we trust the client's total balance.
    // In a real game, you would validate clicks and time elapsed.
    const user = await prisma.user.update({
      where: { telegramId: String(telegramId) },
      data: {
        balance: balanceTotal,
        stamina: staminaTotal,
        lastStaminaSync: new Date(),
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error syncing:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
