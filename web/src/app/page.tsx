import Link from "next/link";
import { auth } from "@/auth";

export default async function HomePage() {
  const session = await auth();

  return (
    <main style={{ padding: 24 }}>
      <h1>V-SAA Dashboard</h1>
      <p>Manage welcome messages, auto roles, logs, and bot settings.</p>

      {session ? (
        <Link href="/dashboard">Open dashboard</Link>
      ) : (
        <a href="/api/auth/signin">Sign in with Discord</a>
      )}
    </main>
  );
}