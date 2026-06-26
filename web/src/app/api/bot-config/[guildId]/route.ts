import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { guildId: string } }
) {
  const apiKey = request.headers.get("x-api-key");

  if (!apiKey || apiKey !== process.env.BOT_API_KEY) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const config = await prisma.guildConfig.findUnique({
    where: { guildId: params.guildId },
  });

  return NextResponse.json(config ?? {});
}