import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";
import { canManageGuild, getUserGuilds } from "@/lib/discord";

async function assertAccess(guildId: string) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return {
      ok: false as const,
      response: NextResponse.json({ error: "Not signed in" }, { status: 401 }),
    };
  }

  const accessToken = (session as any).accessToken as string | undefined;

  if (!accessToken) {
    return {
      ok: false as const,
      response: NextResponse.json(
        { error: "Missing Discord access token" },
        { status: 401 }
      ),
    };
  }

  const guilds = await getUserGuilds(accessToken);
  const guild = guilds.find(
    (g) => g.id === guildId && canManageGuild(g.permissions)
  );

  if (!guild) {
    return {
      ok: false as const,
      response: NextResponse.json(
        { error: "No access to this guild" },
        { status: 403 }
      ),
    };
  }

  return { ok: true as const, session };
}

export async function GET(
  _request: NextRequest,
  { params }: { params: { guildId: string } }
) {
  const { guildId } = params;

  const access = await assertAccess(guildId);
  if (!access.ok) return access.response;

  const config = await prisma.guildConfig.findUnique({
    where: { guildId },
  });

  return NextResponse.json(config ?? {});
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { guildId: string } }
) {
  const { guildId } = params;

  const access = await assertAccess(guildId);
  if (!access.ok) return access.response;

  const body = await request.json();

  const config = await prisma.guildConfig.upsert({
    where: { guildId },
    create: {
      guildId,
      welcomeEnabled: Boolean(body.welcomeEnabled),
      welcomeChannelId: body.welcomeChannelId || null,
      welcomeMessage: body.welcomeMessage || null,
      autoRoleEnabled: Boolean(body.autoRoleEnabled),
      autoRoleId: body.autoRoleId || null,
      logChannelId: body.logChannelId || null,
      moderationLogChannelId: body.moderationLogChannelId || null,
      allowedRoleIds: body.allowedRoleIds ?? [],
    },
    update: {
      welcomeEnabled: Boolean(body.welcomeEnabled),
      welcomeChannelId: body.welcomeChannelId || null,
      welcomeMessage: body.welcomeMessage || null,
      autoRoleEnabled: Boolean(body.autoRoleEnabled),
      autoRoleId: body.autoRoleId || null,
      logChannelId: body.logChannelId || null,
      moderationLogChannelId: body.moderationLogChannelId || null,
      allowedRoleIds: body.allowedRoleIds ?? [],
    },
  });

  return NextResponse.json(config);
}
