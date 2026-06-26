import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import { canManageGuild, getUserGuilds } from "@/lib/discord";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/");
  }

  const accessToken = (session as any).accessToken as string | undefined;

  if (!accessToken) {
    redirect("/");
  }

  const guilds = await getUserGuilds(accessToken);
  const managedGuilds = guilds.filter((g) => canManageGuild(g.permissions));

  return (
    <main style={{ padding: 24 }}>
      <h1>Dashboard</h1>

      {managedGuilds.length === 0 ? (
        <p>No guilds you can manage were found.</p>
      ) : (
        <ul>
          {managedGuilds.map((guild) => (
            <li key={guild.id}>{guild.name}</li>
          ))}
        </ul>
      )}
    </main>
  );
}
