import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  // Simple auth for prototype: check header or query
  const apikey = req.headers.get('x-admin-key');
  if (apikey !== 'supersecretringo') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const users = await prisma.user.findMany({
      include: {
        purchases: true,
      },
      orderBy: {
        balance: 'desc'
      }
    });
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const apikey = req.headers.get('x-admin-key');
  if (apikey !== 'supersecretringo') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { userId, balance } = body;

    const user = await prisma.user.update({
      where: { id: userId },
      data: { balance },
    });

    return NextResponse.json(user);
  } catch(error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
