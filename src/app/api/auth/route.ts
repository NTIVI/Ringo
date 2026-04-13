import { NextResponse } from "next/server";
import { validateWebAppData } from "@/lib/telegramAuth";
import { PrismaClient } from "@prisma/client"; // Adjust import path if needed

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { initData, user } = await req.json();

    // WARNING: In production, you MUST define BOT_TOKEN in .env and validate!
    // const botToken = process.env.BOT_TOKEN;
    // if (!botToken || !validateWebAppData(initData, botToken)) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    // For demonstration, we allow passing if it has user ID
    if (!user || !user.id) {
      return NextResponse.json({ error: "Invalid user data" }, { status: 400 });
    }

    const tgId = user.id.toString();

    let dbUser = await prisma.user.findUnique({
      where: { id: tgId },
    });

    const now = new Date();
    
    if (!dbUser) {
      dbUser = await prisma.user.create({
        data: {
          id: tgId,
          firstName: user.first_name,
          username: user.username || null,
          coinsBalance: 1000, // Initial bonus
          streakDays: 1,
          lastLogin: now,
        },
      });
    } else {
      // Daily streak logic
      const lastLoginDate = new Date(dbUser.lastLogin);
      const isNextDay = now.getDate() !== lastLoginDate.getDate() || now.getMonth() !== lastLoginDate.getMonth();
      const isConsecutiveDay = (now.getTime() - lastLoginDate.getTime()) <= 48 * 60 * 60 * 1000 && isNextDay;

      let newStreak = dbUser.streakDays;
      let newBalance = dbUser.coinsBalance;

      if (isNextDay) {
        if (isConsecutiveDay) {
          newStreak += 1;
        } else {
          newStreak = 1; // Reset streak
        }
        // Give daily bonus based on streak
        newBalance += Math.min(newStreak * 100, 1000); // Up to 1000 bonus
      }

      dbUser = await prisma.user.update({
        where: { id: tgId },
        data: {
          firstName: user.first_name,
          username: user.username || null,
          lastLogin: now,
          streakDays: newStreak,
          coinsBalance: newBalance,
        },
      });
    }

    return NextResponse.json({ success: true, user: dbUser });
  } catch (error) {
    console.error("Auth Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
