import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const topUsers = await prisma.user.findMany({
      orderBy: { balance: 'desc' },
      take: 100,
      select: {
        id: true,
        telegramId: true,
        name: true,
        balance: true,
      },
    });

    return NextResponse.json(topUsers);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
