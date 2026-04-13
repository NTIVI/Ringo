import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { password, orderId, status } = await req.json();

    if (password !== "admin123") { // In production use process.env.ADMIN_PASSWORD
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!orderId || !status) {
      return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
    }

    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status },
    });

    return NextResponse.json({ success: true, order });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const password = searchParams.get("password");

    if (password !== "admin123") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orders = await prisma.order.findMany({
      include: { user: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, orders });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
