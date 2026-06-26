const cache = new Map();

async function getGuildConfig(guildId) {
  const cached = cache.get(guildId);
  if (cached && Date.now() - cached.at < 30000) {
    return cached.value;
  }

  const res = await fetch(`${process.env.DASHBOARD_URL}/api/bot-config/${guildId}`, {
    headers: {
      "x-api-key": process.env.BOT_API_KEY,
    },
  });

  if (!res.ok) return null;

  const value = await res.json();
  cache.set(guildId, { at: Date.now(), value });
  return value;
}

module.exports = { getGuildConfig };