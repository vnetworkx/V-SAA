"use client";

import { useState } from "react";

type GuildConfig = {
  welcomeEnabled?: boolean;
  welcomeChannelId?: string | null;
  welcomeMessage?: string | null;
  autoRoleEnabled?: boolean;
  autoRoleId?: string | null;
  logChannelId?: string | null;
  moderationLogChannelId?: string | null;
  allowedRoleIds?: string[] | null;
};

export default function GuildEditor({
  guildId,
  initialConfig,
}: {
  guildId: string;
  initialConfig: GuildConfig;
}) {
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");
  const [form, setForm] = useState({
    welcomeEnabled: initialConfig.welcomeEnabled ?? false,
    welcomeChannelId: initialConfig.welcomeChannelId ?? "",
    welcomeMessage: initialConfig.welcomeMessage ?? "Welcome {user} to {server}!",
    autoRoleEnabled: initialConfig.autoRoleEnabled ?? false,
    autoRoleId: initialConfig.autoRoleId ?? "",
    logChannelId: initialConfig.logChannelId ?? "",
    moderationLogChannelId: initialConfig.moderationLogChannelId ?? "",
    allowedRoleIds: (initialConfig.allowedRoleIds ?? []).join(","),
  });

  async function onSave() {
    setSaving(true);
    setStatus("");

    const res = await fetch(`/api/guilds/${guildId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...form,
        allowedRoleIds: form.allowedRoleIds
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      }),
    });

    setSaving(false);

    if (!res.ok) {
      setStatus("Save failed");
      return;
    }

    setStatus("Saved");
  }

  return (
    <main style={{ padding: 24, maxWidth: 800 }}>
      <h1>Guild settings</h1>
      <p>{guildId}</p>

      <label>
        <input
          type="checkbox"
          checked={form.welcomeEnabled}
          onChange={(e) => setForm({ ...form, welcomeEnabled: e.target.checked })}
        />
        Enable welcome messages
      </label>

      <div>
        <label>Welcome channel ID</label>
        <input
          value={form.welcomeChannelId}
          onChange={(e) => setForm({ ...form, welcomeChannelId: e.target.value })}
        />
      </div>

      <div>
        <label>Welcome message</label>
        <textarea
          value={form.welcomeMessage}
          onChange={(e) => setForm({ ...form, welcomeMessage: e.target.value })}
          rows={4}
        />
      </div>

      <label>
        <input
          type="checkbox"
          checked={form.autoRoleEnabled}
          onChange={(e) => setForm({ ...form, autoRoleEnabled: e.target.checked })}
        />
        Enable auto role
      </label>

      <div>
        <label>Auto role ID</label>
        <input
          value={form.autoRoleId}
          onChange={(e) => setForm({ ...form, autoRoleId: e.target.value })}
        />
      </div>

      <div>
        <label>Log channel ID</label>
        <input
          value={form.logChannelId}
          onChange={(e) => setForm({ ...form, logChannelId: e.target.value })}
        />
      </div>

      <div>
        <label>Moderation log channel ID</label>
        <input
          value={form.moderationLogChannelId}
          onChange={(e) =>
            setForm({ ...form, moderationLogChannelId: e.target.value })
          }
        />
      </div>

      <div>
        <label>Allowed role IDs, comma separated</label>
        <input
          value={form.allowedRoleIds}
          onChange={(e) => setForm({ ...form, allowedRoleIds: e.target.value })}
        />
      </div>

      <button onClick={onSave} disabled={saving}>
        {saving ? "Saving..." : "Save"}
      </button>

      <p>{status}</p>
    </main>
  );
}