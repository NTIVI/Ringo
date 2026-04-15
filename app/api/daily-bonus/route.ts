import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { telegramId } = await req.json();

    if (!telegramId) {
      return NextResponse.json({ error: 'Missing telegramId' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { telegramId: String(telegramId) },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const now = new Date();
    const lastBonus = user.lastDailyBonus;

    if (lastBonus) {
      const diffHours = (now.getTime() - lastBonus.getTime()) / (1000 * 60 * 60);
      if (diffHours < 24) {
        return NextResponse.json({ 
          error: 'Daily bonus already claimed', 
          retryIn: (24 - diffHours).toFixed(1) + ' hours' 
        }, { status: 400 });
      }
    }

    // Reward calculation (e.g., 5000 RNG base)
    const reward = 5000;

    const updatedUser = await prisma.user.update({
      where: { telegramId: String(telegramId) },
      data: {
        balance: { increment: reward },
        lastDailyBonus: now,
      },
    });

    return NextResponse.json({ 
      success: true, 
      reward, 
      newBalance: updatedUser.balance 
    });
  } catch (error) {
    console.error('Daily bonus error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
