import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { tgId, itemTitle, itemPrice, deliveryAddress } = await req.json();

    if (!tgId || !itemTitle || !itemPrice || !deliveryAddress) {
      return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { id: tgId } });
    if (!user || user.coinsBalance < itemPrice) {
      return NextResponse.json({ error: "Insufficient balance" }, { status: 400 });
    }

    // Deduct coins
    await prisma.user.update({
      where: { id: tgId },
      data: { coinsBalance: { decrement: itemPrice } },
    });

    // Create Order
    const order = await prisma.order.create({
      data: {
        userId: tgId,
        itemTitle,
        itemPrice,
        deliveryAddress,
      },
    });

    return NextResponse.json({
      success: true,
      order,
      newBalance: user.coinsBalance - itemPrice,
    });
  } catch (error) {
    console.error("Order Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const tgId = searchParams.get("tgId");

    if (!tgId) {
      return NextResponse.json({ error: "Missing tgId" }, { status: 400 });
    }

    const orders = await prisma.order.findMany({
      where: { userId: tgId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, orders });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
