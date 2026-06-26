export type DiscordGuild = {
  id: string;
  name: string;
  permissions: string;
  icon: string | null;
};

const ADMINISTRATOR = BigInt(8);
const MANAGE_GUILD = BigInt(32);

export function canManageGuild(permissions: string): boolean {
  const perms = BigInt(permissions);
  return (perms & ADMINISTRATOR) !== BigInt(0) || (perms & MANAGE_GUILD) !== BigInt(0);
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
