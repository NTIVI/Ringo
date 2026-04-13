import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Initial mock quests configuration
const DEFAULT_QUESTS = [
  { questType: "play_slots_10", progress: 0, completed: false, description: "Play 10 games of Slots", reward: 200, target: 10 },
  { questType: "win_1000_coins", progress: 0, completed: false, description: "Win 1,000 coins total", reward: 500, target: 1000 },
  { questType: "play_dice_5", progress: 0, completed: false, description: "Play 5 games of Dice", reward: 150, target: 5 },
];

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const tgId = searchParams.get("tgId");

    if (!tgId) {
      return NextResponse.json({ error: "Missing tgId" }, { status: 400 });
    }

    let quests = await prisma.quest.findMany({
      where: { userId: tgId },
    });

    if (quests.length === 0) {
      // Initialize quests
      await prisma.quest.createMany({
        data: DEFAULT_QUESTS.map(q => ({
          userId: tgId,
          questType: q.questType,
          progress: q.progress,
          completed: q.completed,
        })),
      });
      quests = await prisma.quest.findMany({ where: { userId: tgId } });
    }

    // Attach static descriptions and targets
    const mappedQuests = quests.map(q => {
      const def = DEFAULT_QUESTS.find(d => d.questType === q.questType);
      return { ...q, description: def?.description, target: def?.target, reward: def?.reward };
    });

    return NextResponse.json({ success: true, quests: mappedQuests });
  } catch (error) {
    console.error("Quests Get Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { tgId, questId } = await req.json();

    if (!tgId || !questId) {
      return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
    }

    const quest = await prisma.quest.findUnique({ where: { id: questId } });
    if (!quest || quest.userId !== tgId) {
      return NextResponse.json({ error: "Quest not found" }, { status: 404 });
    }

    // In a real app, progress would be tracked and verified here
    // For demo purposes, we will allow users to claim quests directly if simulated

    if (quest.completed) {
      return NextResponse.json({ error: "Already completed" }, { status: 400 });
    }

    const def = DEFAULT_QUESTS.find(d => d.questType === quest.questType);
    if (!def) return NextResponse.json({ error: "Invalid quest type" }, { status: 400 });

    // Mark completed & give reward
    await prisma.quest.update({
      where: { id: questId },
      data: { completed: true, progress: def.target },
    });

    await prisma.user.update({
      where: { id: tgId },
      data: { coinsBalance: { increment: def.reward } },
    });

    return NextResponse.json({ success: true, reward: def.reward });
  } catch (error) {
    console.error("Quests Post Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
