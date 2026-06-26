export type DiscordGuild = {
  id: string;
  name: string;
  permissions: string;
  icon: string | null;
};

export function canManageGuild(permissions: string): boolean {
  const perms = BigInt(permissions);
  const ADMINISTRATOR = 0x8n;
  const MANAGE_GUILD = 0x20n;
  return (perms & ADMINISTRATOR) !== 0n || (perms & MANAGE_GUILD) !== 0n;
}

export async function getUserGuilds(accessToken: string): Promise<DiscordGuild[]> {
  const res = await fetch("https://discord.com/api/users/@me/guilds", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Failed to load Discord guilds: ${res.status}`);
  }

  return res.json();
}