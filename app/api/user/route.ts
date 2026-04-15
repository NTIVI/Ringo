import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { telegramId, name } = body;

    if (!telegramId) {
      return NextResponse.json({ error: 'Missing telegramId' }, { status: 400 });
    }

    let user = await prisma.user.findUnique({
      where: { telegramId: String(telegramId) },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          telegramId: String(telegramId),
          name: name || 'Unknown',
        },
      });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching/creating user:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
