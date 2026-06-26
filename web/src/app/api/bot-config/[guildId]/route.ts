import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ guildId: string }> }
) {
  const { guildId } = await context.params;

  const apiKey = request.headers.get("x-api-key");

  if (apiKey !== process.env.BOT_API_KEY) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const config = await prisma.guildConfig.findUnique({
    where: {
      guildId,
    },
  });

  return NextResponse.json(config ?? {});
}
