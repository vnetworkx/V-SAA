import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getUserGuilds, canManageGuild } from "@/lib/discord";

export default async function DashboardPage() {
  const session = await auth();
  if (!session) redirect("/");

  const accessToken = (session as any).accessToken as string | undefined;
  if (!accessToken) redirect("/");

  const guilds = await getUserGuilds(accessToken);
  const manageableGuilds = guilds.filter((g) => canManageGuild(g.permissions));

  return (
    <main style={{ padding: 24 }}>
      <h1>Your guilds</h1>
      <ul>
        {manageableGuilds.map((guild) => (
          <li key={guild.id}>
            <Link href={`/dashboard/${guild.id}`}>{guild.name}</Link>
          </li>
        ))}
      </ul>
    </main>
  );
}