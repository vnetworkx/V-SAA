const { EmbedBuilder } = require('discord.js');
const { getGuildConfig } = require('../utils/guildConfig');

module.exports = {
  name: 'guildMemberAdd',
  once: false,
  async execute(member) {
    const config = getGuildConfig(member.guild.id);

    if (config.autoRoleId) {
      const role = member.guild.roles.cache.get(config.autoRoleId);
      if (role) {
        try {
          await member.roles.add(role);
        } catch (error) {
          console.error('Auto role error:', error);
        }
      }
    }

    if (!config.welcomeChannelId) return;

    const channel = member.guild.channels.cache.get(config.welcomeChannelId);
    if (!channel) return;

    const title = (config.welcomeTitle || 'Welcome to {server}!').replaceAll('{server}', member.guild.name).replaceAll('{user}', member.user.username);
    const description = (config.welcomeDescription || 'Hey {user}, welcome to **{server}**!').replaceAll('{server}', member.guild.name).replaceAll('{user}', `${member}`);

    const embed = new EmbedBuilder()
      .setTitle(title)
      .setDescription(description)
      .setColor(0x5865F2)
      .setThumbnail(member.user.displayAvatarURL({ size: 256 }))
      .setFooter({ text: `Member #${member.guild.memberCount}` });

    await channel.send({ embeds: [embed] });

    if (config.logChannelId) {
      const logChannel = member.guild.channels.cache.get(config.logChannelId);
      if (logChannel) {
        const logEmbed = new EmbedBuilder()
          .setTitle('Member Joined')
          .setDescription(`${member} joined the server.`)
          .setColor(0x57F287)
          .setTimestamp();

        await logChannel.send({ embeds: [logEmbed] });
      }
    }
  }
};
