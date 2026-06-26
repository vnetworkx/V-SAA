import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/dashboard");
  }

  return (
    <main style={{ padding: 24 }}>
      <h1>Welcome</h1>
      <p>Please sign in to continue.</p>
    </main>
  );
}
