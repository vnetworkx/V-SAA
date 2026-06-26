const { getGuildConfig } = require("../utils/guildConfig");

function formatWelcomeMessage(template, member) {
  return template
    .replaceAll("{user}", `<@${member.id}>`)
    .replaceAll("{server}", member.guild.name)
    .replaceAll("{memberCount}", String(member.guild.memberCount));
}

module.exports = {
  name: "guildMemberAdd",
  async execute(member) {
    const config = await getGuildConfig(member.guild.id);
    if (!config) return;

    if (config.autoRoleEnabled && config.autoRoleId) {
      const role = member.guild.roles.cache.get(config.autoRoleId);
      if (role) {
        await member.roles.add(role).catch(() => {});
      }
    }

    if (config.welcomeEnabled && config.welcomeChannelId && config.welcomeMessage) {
      const channel = member.guild.channels.cache.get(config.welcomeChannelId);
      if (channel && channel.isTextBased()) {
        await channel.send(formatWelcomeMessage(config.welcomeMessage, member)).catch(() => {});
      }
    }
  },
};