import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { telegramId, type, itemId, price } = body;

    if (!telegramId || !type || !itemId || price === undefined) {
      return NextResponse.json({ error: 'Missing purchase data' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { telegramId: String(telegramId) },
    });

    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    if (user.balance < price) {
      return NextResponse.json({ error: 'Insufficient funds' }, { status: 400 });
    }

    // Process Purchase
    const result = await prisma.$transaction(async (tx: any) => {
      const updatedUser = await tx.user.update({
        where: { telegramId: String(telegramId) },
        data: {
          balance: { decrement: price },
          ...(type === 'DONUT' ? { currentDonutId: parseInt(itemId) } : {}),
        },
      });

      await tx.purchase.create({
        data: {
          userId: updatedUser.id,
          type,
          itemId: String(itemId),
          price,
        },
      });

      return updatedUser;
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in purchase:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
