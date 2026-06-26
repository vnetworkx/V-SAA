import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { canManageGuild, getUserGuilds } from "@/lib/discord";
import GuildEditor from "@/components/GuildEditor";

export default async function GuildPage({
  params,
}: {
  params: { guildId: string };
}) {
  const session = await auth();
  if (!session) redirect("/");

  const accessToken = (session as any).accessToken as string | undefined;
  if (!accessToken) redirect("/");

  const guilds = await getUserGuilds(accessToken);
  const allowed = guilds.some(
    (g) => g.id === params.guildId && canManageGuild(g.permissions)
  );

  if (!allowed) {
    return <main style={{ padding: 24 }}>No access to this guild.</main>;
  }

  const config = await prisma.guildConfig.findUnique({
    where: { guildId: params.guildId },
  });

  const initialConfig = config
    ? {
        ...config,
        allowedRoleIds: Array.isArray(config.allowedRoleIds)
          ? (config.allowedRoleIds as string[])
          : [],
      }
    : {
        guildId: params.guildId,
        welcomeEnabled: false,
        welcomeChannelId: null,
        welcomeMessage: null,
        autoRoleEnabled: false,
        autoRoleId: null,
        logChannelId: null,
        moderationLogChannelId: null,
        allowedRoleIds: [],
        updatedAt: new Date(),
        createdAt: new Date(),
      };

  return (
    <GuildEditor
      guildId={params.guildId}
      initialConfig={initialConfig}
    />
  );
}
